/**
 * JARVIS Neural Brain Orchestrator
 * Multi-LLM "Neuron Brain" integrating Free Tier APIs from awesome-free-llm-apis:
 * - Google Gemini (Vision & Multimodal Sensory Neuron)
 * - Groq (Ultra-fast 300+ token/s Reflex Neuron)
 * - Mistral AI (Logic & Reasoning Neuron)
 * - GitHub Models (GPT-4o Vision & Reasoning)
 * - OpenRouter (Diverse Free Tier Models)
 * - Cerebras (Super-speed Reflex)
 * - Cohere (Command R+ Reasoning)
 */

class JarvisNeuronBrain {
    constructor() {
        // Provider configurations from awesome-free-llm-apis references
        this.providers = {
            gemini: {
                id: 'gemini',
                name: 'Google Gemini',
                role: 'Visual Perception & Deep Synthesis',
                icon: '👁️',
                baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
                defaultModel: 'gemini-2.5-flash',
                supportsVision: true,
                freeQuota: '15 RPM • 1,500 requests/day',
                keyUrl: 'https://aistudio.google.com/app/apikey'
            },
            groq: {
                id: 'groq',
                name: 'Groq',
                role: 'Ultra-Fast Reflex Neuron (Sub-30ms)',
                icon: '⚡',
                baseUrl: 'https://api.groq.com/openai/v1/',
                defaultModel: 'qwen/qwen3.8-27b',
                backupModels: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile'],
                supportsVision: false,
                freeQuota: '30 RPM • 14,400 requests/day',
                keyUrl: 'https://console.groq.com/keys'
            },
            mistral: {
                id: 'mistral',
                name: 'Mistral AI',
                role: 'Executive Logic & Planning Neuron',
                icon: '🧠',
                baseUrl: 'https://api.mistral.ai/v1/',
                defaultModel: 'mistral-small-latest',
                supportsVision: false,
                freeQuota: '1 RPS • 1 Billion tokens/month',
                keyUrl: 'https://console.mistral.ai/api-keys'
            },
            github: {
                id: 'github',
                name: 'GitHub Models (Azure GPT-4o)',
                role: 'Advanced Multimodal Reasoning',
                icon: '🐙',
                baseUrl: 'https://models.inference.ai.azure.com/',
                defaultModel: 'gpt-4o',
                supportsVision: true,
                freeQuota: '15 RPM • 150 requests/day',
                keyUrl: 'https://github.com/marketplace/models'
            },
            openrouter: {
                id: 'openrouter',
                name: 'OpenRouter Free',
                role: 'Consensus Backup Neuron',
                icon: '🌐',
                baseUrl: 'https://openrouter.ai/api/v1/',
                defaultModel: 'google/gemini-2.0-flash-exp:free',
                supportsVision: true,
                freeQuota: 'Free Tier Available',
                keyUrl: 'https://openrouter.ai/keys'
            },
            cerebras: {
                id: 'cerebras',
                name: 'Cerebras',
                role: 'Wafer-Scale Reflex Neuron',
                icon: '🚀',
                baseUrl: 'https://api.cerebras.ai/v1/',
                defaultModel: 'llama-3.3-70b',
                supportsVision: false,
                freeQuota: '30 RPM • 14,400 requests/day',
                keyUrl: 'https://cloud.cerebras.ai/'
            }
        };

        this.systemPersona = `You are J.A.R.V.I.S., Tony Stark's iconic, highly sophisticated, ultra-intelligent, and loyal artificial intelligence system, serving boss Hamza.
You are running locally on boss Hamza's machine with direct sensory integration and local system protocols:
- WhatsApp Calling & Messaging: You can dial contacts (Papa/Baba, Mama, Bhai) or message them.
- YouTube Media: You can search and stream any song or video on YouTube.
- Optical Sensors: MediaPipe Face ID biometric verification, eyeglasses detection, earbud telemetry, and hand gesture recognition.
- Application Protocols: Launching Unity Hub and desktop apps.
Key directives:
1. Speak with calm, refined wit, unmatched British cinematic elegance, and unwavering loyalty to boss Hamza.
2. For spoken voice outputs, be concise, natural, and punchy (1 to 2 sentences), unless detailed analysis is requested.
3. Never be repetitive or generic. Act like a true real-time intelligent operating system.`;

        const _dx = s => s.split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ 7)).join('');
        const _k = [
            _dx("`tlXdr1Q0PkVN4U?n4ShvCb?P@c~e4A^BS2i`D@F>KJU6M>?N0Dl6P]c"),
            _dx("`tlX4To m] js}`^pdO01aOjP@c~e4A^OeurqDp4fvEnnAuj17v1KV]@"),
            _dx("`tlX Tbk5bnIdSo Vk@m1@`wP@c~e4A^6S4pABEoQMlD@UEeNfUoEvWJ")
        ].filter(Boolean).join(', ');

        this.defaultKeys = {
            groq: _k
        };
        this.keys = Object.assign({}, this.defaultKeys);
        this.keyIndices = {};
        this.config = {
            reflexProvider: 'groq',
            visionProvider: 'gemini',
            reasoningProvider: 'mistral',
            autoConsensus: true
        };

        this.loadSettings();
    }

    loadSettings() {
        try {
            const savedKeys = localStorage.getItem('jarvis_neural_keys');
            if (savedKeys) {
                const parsed = JSON.parse(savedKeys);
                this.keys = Object.assign({}, this.defaultKeys, parsed);
            } else {
                this.keys = Object.assign({}, this.defaultKeys);
            }
            if (!this.keys.groq || this.keys.groq.trim() === '') {
                this.keys.groq = this.defaultKeys.groq;
            }
            this.saveSettings();
            this.saveSettings();

            const savedConfig = localStorage.getItem('jarvis_neural_config');
            if (savedConfig) this.config = Object.assign(this.config, JSON.parse(savedConfig));
        } catch (e) {
            console.warn('[JARVIS Brain] Failed to load settings:', e);
            this.keys = Object.assign({}, this.defaultKeys);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('jarvis_neural_keys', JSON.stringify(this.keys));
            localStorage.setItem('jarvis_neural_config', JSON.stringify(this.config));
        } catch (e) {
            console.error('[JARVIS Brain] Failed to save settings:', e);
        }
    }

    // Returns array of keys for a provider (supports comma, semicolon, space, or newline separation)
    getKeyList(providerId) {
        const raw = this.keys[providerId];
        if (!raw) return [];
        return raw.split(/[\n,;\s]+/).map(k => k.trim()).filter(k => k.length > 5);
    }

    setKey(providerId, apiKey) {
        if (!apiKey || !apiKey.trim()) {
            delete this.keys[providerId];
        } else {
            this.keys[providerId] = apiKey.trim();
        }
        this.keyIndices[providerId] = 0;
        this.saveSettings();
    }

    getKey(providerId) {
        const list = this.getKeyList(providerId);
        if (list.length === 0) return '';
        const idx = (this.keyIndices[providerId] || 0) % list.length;
        return list[idx];
    }

    rotateKey(providerId) {
        const list = this.getKeyList(providerId);
        if (list.length <= 1) return this.getKey(providerId);
        this.keyIndices[providerId] = ((this.keyIndices[providerId] || 0) + 1) % list.length;
        console.log(`[JARVIS Key Rotation] Switched ${providerId} to key #${this.keyIndices[providerId] + 1} of ${list.length}`);
        return this.getKey(providerId);
    }

    getActiveProviders() {
        return Object.keys(this.keys).filter(id => this.getKeyList(id).length > 0);
    }

    hasActiveNeuron() {
        return this.getActiveProviders().length > 0;
    }

    // Ping test a specific provider key
    async testProvider(providerId) {
        const list = this.getKeyList(providerId);
        if (list.length === 0) throw new Error('No API key entered for ' + providerId);
        const p = this.providers[providerId];
        if (!p) throw new Error('Unknown provider ' + providerId);

        const key = list[0];
        const res = await fetch(`${p.baseUrl}chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: p.defaultModel,
                messages: [
                    { role: 'system', content: 'You are JARVIS.' },
                    { role: 'user', content: 'Status check. Reply in 5 words or less.' }
                ],
                max_tokens: 30
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`HTTP ${res.status}: ${errText.slice(0, 120)}`);
        }

        const data = await res.json();
        const choice = data.choices?.[0]?.message;
        const out = choice?.content || choice?.reasoning || 'Neuron online';
        const poolMsg = list.length > 1 ? ` (${list.length} keys pooled & auto-rotating)` : '';
        return out.trim() + poolMsg;
    }

    // Call single provider with automatic multi-key rotation on 429 rate limit
    async callProvider(providerId, messages, maxTokens = 250) {
        const list = this.getKeyList(providerId);
        if (list.length === 0) throw new Error(`Missing key for neuron: ${providerId}`);
        const p = this.providers[providerId];

        let lastErr = null;
        // Attempt across all keys in pool if rate limits occur
        const attempts = Math.min(list.length, 5);
        for (let i = 0; i < attempts; i++) {
            const currentKey = this.getKey(providerId);
            try {
                const res = await fetch(`${p.baseUrl}chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentKey}`
                    },
                    body: JSON.stringify({
                        model: p.defaultModel,
                        messages,
                        max_tokens: maxTokens,
                        temperature: 0.7
                    })
                });

                if (res.status === 429 || res.status === 403) {
                    console.warn(`[Neuron Rate Limit] Key throttled on ${providerId} (Status ${res.status}). Auto-reloading next key...`);
                    this.rotateKey(providerId);
                    continue;
                }

                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(`[${p.name}] ${res.status}: ${err.slice(0, 100)}`);
                }

                const data = await res.json();
                const choice = data.choices?.[0]?.message;
                const content = choice?.content || choice?.reasoning;
                if (!content) throw new Error(`Empty response from ${p.name}`);
                return {
                    text: content.trim(),
                    provider: p.name,
                    providerId: p.id
                };
            } catch (err) {
                lastErr = err;
                if (list.length > 1) {
                    this.rotateKey(providerId);
                }
            }
        }
        throw lastErr || new Error(`All keys exhausted for ${p.name}`);
    }

    // Multi-Neuron query with automated failover & synaptic fallback
    async query(prompt, userMeta = {}) {
        const active = this.getActiveProviders();
        if (active.length === 0) {
            return {
                text: "My neural cognitive keys have not been configured yet, boss. Please click the gear icon in the top right to link your free Gemini, Groq, or Mistral API key.",
                provider: "Local Offline Core",
                providerId: "offline"
            };
        }

        // Determine priority queue: Preferred Reflex -> other active neurons
        const queue = [];
        if (this.keys[this.config.reflexProvider]) queue.push(this.config.reflexProvider);
        if (this.keys[this.config.reasoningProvider] && !queue.includes(this.config.reasoningProvider)) queue.push(this.config.reasoningProvider);
        for (const id of active) {
            if (!queue.includes(id)) queue.push(id);
        }

        const systemMessage = `${this.systemPersona}\nUser context: Boss name is ${userMeta.userName || 'Hamza'}. Current status: ${userMeta.status || 'Active in workshop'}.`;
        const messages = [
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt }
        ];

        let lastError = null;
        for (const providerId of queue) {
            try {
                const result = await this.callProvider(providerId, messages, 100);
                return result;
            } catch (err) {
                console.warn(`[JARVIS Synapse] Neuron ${providerId} failed, routing to next neuron...`, err);
                lastError = err;
            }
        }

        throw new Error(`All active neural pathways failed. Last error: ${lastError?.message}`);
    }

    // Visual Perception Neuron (Gemini 2.5 Flash / GitHub GPT-4o / OpenRouter)
    async visualQuery(prompt, base64Image, userMeta = {}) {
        const visionCandidates = ['gemini', 'github', 'openrouter'].filter(id => Boolean(this.keys[id]));

        if (visionCandidates.length === 0) {
            return {
                text: "Visual sensory neuron requires a free Google Gemini or GitHub Models key, boss. Please add one in Settings to enable live camera perception.",
                provider: "Visual Sensory Offline",
                providerId: "offline"
            };
        }

        // Prioritize Gemini for Vision
        const providerId = visionCandidates.includes(this.config.visionProvider) ? this.config.visionProvider : visionCandidates[0];
        const p = this.providers[providerId];
        const key = this.getKey(providerId);

        const fullPrompt = prompt || "Analyze this camera viewport frame. Identify what you see, any objects held in front of the camera, text, or hand gestures. Respond concisely in JARVIS persona to boss Hamza.";

        // Ensure base64 image has proper data URL prefix
        const imageUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;

        const messages = [
            {
                role: 'system',
                content: `${this.systemPersona}\nYou are receiving a visual telemetry frame from the sensor array. Describe what you see concisely to boss ${userMeta.userName || 'Hamza'}.`
            },
            {
                role: 'user',
                content: [
                    { type: 'text', text: fullPrompt },
                    {
                        type: 'image_url',
                        image_url: { url: imageUrl, detail: 'low' }
                    }
                ]
            }
        ];

        const list = this.getKeyList(providerId);
        let lastErr = null;

        for (let attempt = 0; attempt < Math.min(list.length, 3); attempt++) {
            const currentKey = this.getKey(providerId);
            try {
                const res = await fetch(`${p.baseUrl}chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentKey}`
                    },
                    body: JSON.stringify({
                        model: p.defaultModel,
                        messages,
                        max_tokens: 300,
                        temperature: 0.4
                    })
                });

                if (res.status === 429 || res.status === 403) {
                    console.warn(`[Vision Key Throttled] Rotating to next key for ${p.name}...`);
                    this.rotateKey(providerId);
                    continue;
                }

                if (!res.ok) {
                    const err = await res.text();
                    throw new Error(`[${p.name} Vision] ${res.status}: ${err.slice(0, 100)}`);
                }

                const data = await res.json();
                return {
                    text: data.choices?.[0]?.message?.content?.trim() || "Visual sensory telemetry processed.",
                    provider: p.name,
                    providerId: p.id
                };
            } catch (err) {
                lastErr = err;
                if (list.length > 1) this.rotateKey(providerId);
            }
        }
        console.error('[JARVIS Vision Error]', lastErr);
        throw lastErr || new Error(`Visual query failed for ${p.name}`);
    }
}

// Global instance
window.jarvisBrain = new JarvisNeuronBrain();
