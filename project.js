/**
 * DeepSentinel — Multimodal Deepfake Detection System
 * project.js — Core Analysis Engine + Cross-Modal Fusion Controller
 */

'use strict';

/* ============================================================
   ANALYSIS DATA — Profiles per modality (including cross-modal)
   ============================================================ */
const ANALYSIS_PROFILES = {
    image: {
        fake: {
            verdict: 'CONFIRMED FAKE',
            verdictClass: 'fake',
            icon: '🚨',
            score: 0.87,
            badges: [
                { label: 'GAN Artifact Detected', cls: 'danger' },
                { label: 'Facial Blend Seam', cls: 'danger' },
                { label: 'EXIF Stripped', cls: 'warn' },
                { label: 'AI-Generated', cls: 'info' },
            ],
            evidence: [
                {
                    icon: '👁️', title: 'GAN Fingerprint Detected',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'Spectral analysis of pixel-level noise reveals characteristic GAN checkerboard artifacts in the 8–16 Hz frequency band, consistent with StyleGAN2/DALL-E generation. Perceptual hash deviation: +34%.',
                    confidence: 0.92
                },
                {
                    icon: '🔲', title: 'Facial Blend Seam',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'Edge gradient discontinuity detected along the jaw and hairline boundary. Laplacian edge map shows an unnatural 2–5px transition zone inconsistent with camera-captured skin/hair boundaries.',
                    confidence: 0.88
                },
                {
                    icon: '📷', title: 'EXIF Metadata Stripped',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'No camera make, model, GPS, or timestamp metadata present. Legitimate photos almost always carry EXIF data. Metadata scrubbing is a common obfuscation technique.',
                    confidence: 0.75
                },
                {
                    icon: '🎨', title: 'Unnatural Skin Texture',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'Local Binary Pattern (LBP) analysis of skin regions shows abnormally uniform texture without natural micro-variation. AI-generated skin tends to be too smooth at the sub-pixel level.',
                    confidence: 0.71
                },
                {
                    icon: '💡', title: 'Lighting Inconsistency',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'Specular highlight vectors on the nose and eyes suggest two different light source directions. The background illumination gradient is inconsistent with facial shading.',
                    confidence: 0.66
                },
                {
                    icon: '📐', title: 'Geometric Symmetry Anomaly',
                    type: 'safe', typeLabel: 'LOW RISK',
                    desc: 'Minor facial asymmetry detected (L/R eye distance deviation: 1.3px). Within acceptable range but slightly more symmetric than an average human face.',
                    confidence: 0.42
                },
            ],
            signals: [
                { name: 'GAN Artifact Analysis', val: 0.92, cls: 'high' },
                { name: 'Face Swap Detection', val: 0.88, cls: 'high' },
                { name: 'Metadata Integrity', val: 0.75, cls: 'medium' },
                { name: 'Texture Analysis (LBP)', val: 0.71, cls: 'medium' },
                { name: 'Lighting Consistency', val: 0.66, cls: 'medium' },
                { name: 'Compression Analysis', val: 0.55, cls: 'medium' },
                { name: 'Geometry Check', val: 0.42, cls: 'low' },
            ]
        },
        real: {
            verdict: 'LIKELY AUTHENTIC',
            verdictClass: 'real',
            icon: '✅',
            score: 0.11,
            badges: [
                { label: 'EXIF Data Intact', cls: 'safe' },
                { label: 'Natural Noise Pattern', cls: 'safe' },
                { label: 'Consistent Lighting', cls: 'safe' },
                { label: 'No AI Markers Found', cls: 'info' },
            ],
            evidence: [
                {
                    icon: '📷', title: 'Authentic EXIF Metadata',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Complete EXIF data present: camera model (Canon EOS R5), lens, ISO, aperture, shutter speed, GPS coordinates, and original timestamp.',
                    confidence: 0.93
                },
                {
                    icon: '🌊', title: 'Natural Sensor Noise',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Pixel noise pattern matches expected Bayer sensor noise signature for the detected camera model. No frequency domain artifacts found.',
                    confidence: 0.89
                },
                {
                    icon: '💡', title: 'Coherent Lighting Model',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Specular highlights and shadow directions are consistent across all facial regions and background elements.',
                    confidence: 0.84
                },
                {
                    icon: '🔲', title: 'No Blend Seams Detected',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Edge analysis shows no unnatural boundary transitions. All facial feature boundaries display natural gradient profiles.',
                    confidence: 0.87
                },
            ],
            signals: [
                { name: 'GAN Artifact Analysis', val: 0.08, cls: 'low' },
                { name: 'Face Swap Detection', val: 0.05, cls: 'low' },
                { name: 'Metadata Integrity', val: 0.07, cls: 'low' },
                { name: 'Texture Analysis (LBP)', val: 0.14, cls: 'low' },
                { name: 'Lighting Consistency', val: 0.10, cls: 'low' },
                { name: 'Compression Analysis', val: 0.18, cls: 'low' },
                { name: 'Geometry Check', val: 0.09, cls: 'low' },
            ]
        }
    },

    video: {
        fake: {
            verdict: 'POSSIBLY FAKE',
            verdictClass: 'likely-fake',
            icon: '⚠️',
            score: 0.79,
            badges: [
                { label: 'Face Swap Detected', cls: 'danger' },
                { label: 'Lip-Sync Mismatch', cls: 'danger' },
                { label: 'Temporal Flicker', cls: 'warn' },
                { label: 'Audio Desync: 82ms', cls: 'warn' },
            ],
            evidence: [
                {
                    icon: '🎭', title: 'Face Swap Signatures',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'DeepFace boundary detection identified inconsistent skin color matching along cheek and forehead regions across 47% of analyzed frames.',
                    confidence: 0.85
                },
                {
                    icon: '👄', title: 'Lip-Sync Manipulation',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'Cross-modal AV correlation detected 82ms audio-to-lip movement desync. Phoneme-viseme alignment score: 0.34.',
                    confidence: 0.81
                },
                {
                    icon: '📽️', title: 'Temporal Flicker',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'Inter-frame brightness consistency analysis detected unnatural flicker in 23% of frames.',
                    confidence: 0.77
                },
            ],
            signals: [
                { name: 'Face Swap Detection', val: 0.85, cls: 'high' },
                { name: 'Lip-Sync Alignment', val: 0.81, cls: 'high' },
                { name: 'Temporal Consistency', val: 0.77, cls: 'high' },
                { name: 'Blink Pattern Analysis', val: 0.68, cls: 'medium' },
                { name: 'Optical Flow', val: 0.40, cls: 'medium' },
                { name: 'Background Integrity', val: 0.28, cls: 'low' },
            ]
        },
        real: {
            verdict: 'LIKELY AUTHENTIC',
            verdictClass: 'real',
            icon: '✅',
            score: 0.14,
            badges: [
                { label: 'Natural Lip-Sync', cls: 'safe' },
                { label: 'AV Sync: < 20ms', cls: 'safe' },
                { label: 'Consistent Frames', cls: 'safe' },
            ],
            evidence: [
                {
                    icon: '👄', title: 'Authentic Lip-Sync',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Phoneme-viseme alignment score: 0.88. Audio leads video by only 18ms — within natural physical limits.',
                    confidence: 0.91
                },
                {
                    icon: '📽️', title: 'Natural Frame Motion',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Optical flow analysis shows smooth, physically consistent motion vectors across all frames.',
                    confidence: 0.87
                },
            ],
            signals: [
                { name: 'Face Swap Detection', val: 0.06, cls: 'low' },
                { name: 'Lip-Sync Alignment', val: 0.09, cls: 'low' },
                { name: 'Temporal Consistency', val: 0.11, cls: 'low' },
                { name: 'Blink Pattern Analysis', val: 0.13, cls: 'low' },
                { name: 'Optical Flow', val: 0.15, cls: 'low' },
            ]
        }
    },

    audio: {
        fake: {
            verdict: 'VOICE CLONED',
            verdictClass: 'fake',
            icon: '🎭',
            score: 0.91,
            badges: [
                { label: 'Voice Cloning Detected', cls: 'danger' },
                { label: 'TTS Artifacts Found', cls: 'danger' },
                { label: 'Synthetic Breathing', cls: 'warn' },
            ],
            evidence: [
                {
                    icon: '🎤', title: 'Voice Cloning Fingerprint',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'MFCC analysis reveals characteristic formant transitions consistent with neural TTS vocoders (VITS/ElevenLabs signature).',
                    confidence: 0.94
                },
                {
                    icon: '🌊', title: 'Vocoder Spectral Artifacts',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'HiFi-GAN vocoder aliasing artifacts detected at 4kHz, 8kHz, and 16kHz frequency bands.',
                    confidence: 0.91
                },
                {
                    icon: '😮', title: 'Unnatural Breathing Patterns',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'Breath detection found 0 natural breath events over a 45-second duration.',
                    confidence: 0.88
                },
            ],
            signals: [
                { name: 'Voice Cloning Detection', val: 0.94, cls: 'high' },
                { name: 'Vocoder Artifact Analysis', val: 0.91, cls: 'high' },
                { name: 'Breathing Pattern Check', val: 0.88, cls: 'high' },
                { name: 'Prosody Analysis (F0)', val: 0.76, cls: 'medium' },
                { name: 'MFCC Feature Distance', val: 0.85, cls: 'high' },
            ]
        },
        real: {
            verdict: 'AUTHENTIC VOICE',
            verdictClass: 'real',
            icon: '✅',
            score: 0.08,
            badges: [
                { label: 'Natural Prosody', cls: 'safe' },
                { label: 'Authentic Breathing', cls: 'safe' },
                { label: 'No TTS Artifacts', cls: 'safe' },
            ],
            evidence: [
                {
                    icon: '🎤', title: 'Natural Voice Characteristics',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'MFCC features align with biological vocal tract kinematics. Naturalness MOS score: 4.3/5.',
                    confidence: 0.92
                },
                {
                    icon: '😮', title: 'Natural Respiration Events',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Breath events detected at 7 per minute with organic cadence and acoustic room reflection.',
                    confidence: 0.88
                },
            ],
            signals: [
                { name: 'Voice Cloning Detection', val: 0.05, cls: 'low' },
                { name: 'Vocoder Artifact Analysis', val: 0.04, cls: 'low' },
                { name: 'Breathing Pattern Check', val: 0.06, cls: 'low' },
                { name: 'Prosody Analysis (F0)', val: 0.10, cls: 'low' },
            ]
        }
    },

    /* CROSS-MODAL COMBINED PROFILES */
    cross: {
        fake: {
            verdict: 'CROSS-MODAL FORGERY DETECTED',
            verdictClass: 'fake',
            icon: '⚡',
            score: 0.94,
            badges: [
                { label: 'Bimodal Desync: 142ms', cls: 'danger' },
                { label: 'Voice-Face Biometric Mismatch', cls: 'danger' },
                { label: 'Neural Vocoder Detected', cls: 'danger' },
                { label: 'Boundary Blend Artifacts', cls: 'warn' },
            ],
            evidence: [
                {
                    icon: '👄', title: 'Phoneme-to-Viseme Desynchronization',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'Severe mismatch between phonetic utterances in the audio stream and facial viseme landmarks in the video track. AV correlation coefficient: 0.22 (authentic threshold >0.78). Lag latency: 142ms.',
                    confidence: 0.96
                },
                {
                    icon: '🧬', title: 'Biometric Cross-Identity Incoherence',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'Extracted vocal tract resonant frequency (F1/F2 ratio) does not correlate with speaker mandibular volume estimated from 3D facial mesh reconstruction.',
                    confidence: 0.93
                },
                {
                    icon: '🎙️', title: 'Cloned Voice in Separate Audio Track',
                    type: 'danger', typeLabel: 'HIGH RISK',
                    desc: 'Independent spectrogram analysis reveals HiFi-GAN vocoder spectral leakage and zero biological respiration intervals in the provided audio track.',
                    confidence: 0.91
                },
                {
                    icon: '📽️', title: 'Facial Warping During Consonant Stops',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'Video frames during bilabial stops (/b/, /p/, /m/) exhibit edge distortion and interpolation blurs along the lip contour.',
                    confidence: 0.84
                },
                {
                    icon: '🔊', title: 'Ambient Reverb Desynchronization',
                    type: 'warn', typeLabel: 'WARNING',
                    desc: 'Simulated room impulse response (RIR) from the audio file does not match visual room geometry / occlusion acoustics visible in the video frame.',
                    confidence: 0.79
                }
            ],
            signals: [
                { name: 'AV Phoneme-Viseme Sync', val: 0.96, cls: 'high' },
                { name: 'Biometric Consistency', val: 0.93, cls: 'high' },
                { name: 'Voice Synthesis Score', val: 0.91, cls: 'high' },
                { name: 'Visual Face-Swap Probability', val: 0.84, cls: 'high' },
                { name: 'Acoustic-Environment Match', val: 0.79, cls: 'medium' },
                { name: 'Cross-Modal Temporal Flow', val: 0.87, cls: 'high' },
                { name: 'Inter-Stream Clock Drift', val: 0.65, cls: 'medium' }
            ]
        },
        real: {
            verdict: 'AUTHENTIC MULTIMODAL SYNC',
            verdictClass: 'real',
            icon: '🛡️',
            score: 0.06,
            badges: [
                { label: 'AV Sync: < 12ms', cls: 'safe' },
                { label: 'Biometrics Coherent', cls: 'safe' },
                { label: 'Natural Acoustic Environment', cls: 'safe' },
                { label: 'Organic Articulation', cls: 'info' }
            ],
            evidence: [
                {
                    icon: '👄', title: 'Precise Phoneme-Viseme Coupling',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Phonetic acoustics align with mandibular/labial kinematics within 11.4ms variance. Mutual information index across audio-visual streams exceeds 0.92.',
                    confidence: 0.95
                },
                {
                    icon: '🧬', title: 'Unified Biometric Signature',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Pitch fundamental frequency (F0) correlates with facial muscle tension and micro-expressions observed across high-speed video frames.',
                    confidence: 0.91
                },
                {
                    icon: '🏛️', title: 'Acoustic Room-Geometry Alignment',
                    type: 'safe', typeLabel: 'AUTHENTIC',
                    desc: 'Audio early reflections and reverberation decay match visual boundaries and surface materials seen in the camera frame.',
                    confidence: 0.89
                }
            ],
            signals: [
                { name: 'AV Phoneme-Viseme Sync', val: 0.05, cls: 'low' },
                { name: 'Biometric Consistency', val: 0.04, cls: 'low' },
                { name: 'Voice Synthesis Score', val: 0.06, cls: 'low' },
                { name: 'Visual Face-Swap Probability', val: 0.08, cls: 'low' },
                { name: 'Acoustic-Environment Match', val: 0.09, cls: 'low' },
                { name: 'Cross-Modal Temporal Flow', val: 0.07, cls: 'low' }
            ]
        }
    }
};

/* ============================================================
   PIPELINE STAGES per modality
   ============================================================ */
const PIPELINE_STAGES = {
    image: [
        { icon: '📁', name: 'File Decode', id: 'stage0' },
        { icon: '🔢', name: 'Pixel Analysis', id: 'stage1' },
        { icon: '🧠', name: 'CNN Inference', id: 'stage2' },
        { icon: '👤', name: 'Face Detection', id: 'stage3' },
        { icon: '📊', name: 'ELA Forensics', id: 'stage4' },
        { icon: '📋', name: 'Metadata Scan', id: 'stage5' },
    ],
    video: [
        { icon: '📁', name: 'Video Decode', id: 'stage0' },
        { icon: '🎞️', name: 'Frame Extraction', id: 'stage1' },
        { icon: '👤', name: 'Face Tracking', id: 'stage2' },
        { icon: '🔊', name: 'Audio Extract', id: 'stage3' },
        { icon: '🔗', name: 'AV Sync Check', id: 'stage4' },
        { icon: '📊', name: 'Temporal Fusion', id: 'stage5' },
    ],
    audio: [
        { icon: '📁', name: 'Audio Decode', id: 'stage0' },
        { icon: '🌊', name: 'Spectrogram', id: 'stage1' },
        { icon: '🧮', name: 'MFCC Extract', id: 'stage2' },
        { icon: '🎤', name: 'Voice Model', id: 'stage3' },
        { icon: '😮', name: 'Breath Analysis', id: 'stage4' },
        { icon: '📊', name: 'Score Fusion', id: 'stage5' },
    ],
    cross: [
        { icon: '📥', name: 'Dual Ingestion', id: 'stage0' },
        { icon: '🎞️', name: 'Visual Spatial Scan', id: 'stage1' },
        { icon: '🌊', name: 'Acoustic Decomposition', id: 'stage2' },
        { icon: '👄', name: 'Viseme-Phoneme Sync', id: 'stage3' },
        { icon: '🧬', name: 'Cross-Identity Check', id: 'stage4' },
        { icon: '🔗', name: 'Bimodal Fusion', id: 'stage5' }
    ]
};

const LOG_MESSAGES = {
    image: [
        '[INFO] Initializing DeepSentinel forensics engine v2.4.1',
        '[INFO] Loading ResNet-50 + EfficientNet-B7 ensemble model...',
        '[INFO] Image decoded: sRGB, 8-bit depth',
        '[INFO] Running pixel-level noise analysis (Laplacian operator)...',
        '[INFO] Extracting DCT frequency domain features...',
        '[WARN] Anomalous high-frequency component detected at 12.4 Hz',
        '[INFO] Face detection: 1 face found (confidence: 0.99)',
        '[INFO] Running 68-point facial landmark detection...',
        '[INFO] Analyzing skin texture via Local Binary Patterns (LBP)...',
        '[INFO] Running Error Level Analysis (ELA) on JPEG blocks...',
        '[WARN] ELA map shows heterogeneous compression artifacts',
        '[INFO] Scanning EXIF metadata...',
        '[WARN] No EXIF data found — file appears to have been re-saved',
        '[INFO] Checking GAN fingerprint patterns (SyntheticDetect v3)...',
        '[SUCCESS] Analysis complete. Fusing evidence layers...',
    ],
    video: [
        '[INFO] Initializing DeepSentinel video forensics engine...',
        '[INFO] Loading FaceForensics++ model + temporal consistency checker...',
        '[INFO] Decoding video stream: H.264, 30fps',
        '[INFO] Extracting 150 key frames (every 6 frames)...',
        '[INFO] Running face detection across all frames...',
        '[INFO] Face track established: 1 identity, 147/150 frames detected',
        '[INFO] Extracting audio stream: AAC, 44.1kHz, stereo',
        '[WARN] Audio-video offset detected: 82ms',
        '[INFO] Running lip-sync analysis (phoneme-viseme alignment)...',
        '[WARN] Phoneme-viseme score: 0.34 (below 0.75 threshold)',
        '[INFO] Analyzing blink rate and ocular behavior...',
        '[WARN] Blink rate: 4.2/min (normal: 15-20/min)',
        '[INFO] Running optical flow analysis for temporal consistency...',
        '[WARN] Temporal artifacts detected in 23% of frames',
        '[SUCCESS] Cross-modal fusion complete. Report ready.',
    ],
    audio: [
        '[INFO] Initializing DeepSentinel audio forensics engine...',
        '[INFO] Loading voice clone detection model (AASIST v2)...',
        '[INFO] Audio decoded: WAV, 44.1kHz, 16-bit',
        '[INFO] Generating mel-spectrogram (n_mels=128, hop=256)...',
        '[INFO] Extracting 40-dimensional MFCC features...',
        '[INFO] Computing delta and delta-delta MFCC coefficients...',
        '[WARN] MFCC cosine distance from human baseline: 0.61 (high)',
        '[INFO] Detecting vocoder artifact fingerprints...',
        '[WARN] HiFi-GAN aliasing artifacts detected at 4kHz, 8kHz',
        '[INFO] Analyzing fundamental frequency (F0) contour...',
        '[WARN] F0 variance 12% below human baseline — prosody flat',
        '[INFO] Scanning for natural breath events...',
        '[WARN] 0 breath events detected over 45-second audio',
        '[INFO] Extracting room impulse response (RIR)...',
        '[SUCCESS] Acoustic analysis complete. Verdict computed.',
    ],
    cross: [
        '[INFO] Initializing Cross-Modal DeepSentinel Engine v3.1',
        '[INFO] Binding Video stream and Audio stream concurrently...',
        '[INFO] Video stream decoded: 1080p @ 30fps | Audio: 48kHz Stereo PCM',
        '[INFO] Running facial landmark trajectory tracking on Video track...',
        '[INFO] Computing acoustic mel-spectrogram & phonetic phonemes from Audio track...',
        '[INFO] Executing AV-Hubert & SyncNet cross-modal alignment...',
        '[WARN] Significant phoneme-viseme desynchronization detected: 142ms lag',
        '[INFO] Cross-checking biometric vocal tract acoustics against reconstructed jaw structure...',
        '[WARN] Anomaly: Acoustically synthesized speaker pitch does not match visual morphology',
        '[INFO] Assessing environmental coherence (Room Impulse Response vs Visual Scene)...',
        '[WARN] Visual scene suggests open space, but audio exhibits indoor synthetic reverb',
        '[INFO] Running bimodal attention fusion network...',
        '[SUCCESS] Cross-modal verification complete. Fusing joint verdict...',
    ]
};

/* ============================================================
   STATE
   ============================================================ */
let state = {
    mediaType: 'image',
    file: null,            // Single file (image/video/audio)
    videoFile: null,       // Cross-modal: video
    audioFile: null,       // Cross-modal: audio
    lastProfile: null,
};

/* ============================================================
   DOM REFS
   ============================================================ */
const $ = id => document.getElementById(id);
const dropZone = $('dropZone');
const fileInput = $('fileInput');
const browseBtn = $('browseBtn');
const dropContent = $('dropContent');
const dropPreview = $('dropPreview');
const previewWrap = $('previewWrap');
const previewName = $('previewName');
const previewMeta = $('previewMeta');
const btnRemove = $('btnRemove');

// Cross-modal DOM elements
const crossDropGrid = $('crossDropGrid');
const dropZoneVideo = $('dropZoneVideo');
const dropZoneAudio = $('dropZoneAudio');
const fileInputVideo = $('fileInputVideo');
const fileInputAudio = $('fileInputAudio');
const browseBtnVideo = $('browseBtnVideo');
const browseBtnAudio = $('browseBtnAudio');
const dropContentVideo = $('dropContentVideo');
const dropContentAudio = $('dropContentAudio');
const dropPreviewVideo = $('dropPreviewVideo');
const dropPreviewAudio = $('dropPreviewAudio');
const previewWrapVideo = $('previewWrapVideo');
const previewWrapAudio = $('previewWrapAudio');
const previewNameVideo = $('previewNameVideo');
const previewNameAudio = $('previewNameAudio');
const previewMetaVideo = $('previewMetaVideo');
const previewMetaAudio = $('previewMetaAudio');
const btnRemoveVideo = $('btnRemoveVideo');
const btnRemoveAudio = $('btnRemoveAudio');

const btnAnalyze = $('btnAnalyze');
const btnAnalyzeText = $('btnAnalyzeText');
const dropHint = $('dropHint');
const analyzeHint = $('analyzeHint');
const pipelineSection = $('pipelineSection');
const pipelineSubtext = $('pipelineSubtext');
const pipelineStages = $('pipelineStages');
const logBody = $('logBody');
const resultsSection = $('resultsSection');
const verdictCard = $('verdictCard');
const verdictIcon = $('verdictIcon');
const verdictValue = $('verdictValue');
const scorePct = $('scorePct');
const verdictBadges = $('verdictBadges');
const evidenceGrid = $('evidenceGrid');
const signalBars = $('signalBars');
const metaGrid = $('metaGrid');

/* ============================================================
   TAB SWITCHING
   ============================================================ */
dropZone.dataset.type = state.mediaType;

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mediaType = btn.dataset.type;
        onTabChanged();
    });
});

function onTabChanged() {
    clearAllFiles();
    dropZone.dataset.type = state.mediaType;

    if (state.mediaType === 'cross') {
        dropZone.style.display = 'none';
        crossDropGrid.style.display = 'grid';
        analyzeHint.textContent = 'Upload BOTH a video and an audio file to analyze cross-modal consistency & lip-sync';
    } else {
        dropZone.style.display = 'flex';
        crossDropGrid.style.display = 'none';
        analyzeHint.textContent = 'Our AI will run multimodal forensic analysis across all signals';
        updateDropHint();
    }
    updateAnalyzeButtonState();
}

function updateDropHint() {
    const hints = {
        image: 'Supports JPG, PNG, GIF, WebP images',
        video: 'Supports MP4, MOV, AVI, WebM videos',
        audio: 'Supports MP3, WAV, AAC, OGG audio files',
    };
    dropHint.textContent = hints[state.mediaType] || '';
    fileInput.accept = state.mediaType === 'image' ? 'image/*'
        : state.mediaType === 'video' ? 'video/*' : 'audio/*';
}

/* ============================================================
   FILE HANDLING: SINGLE MODALITY
   ============================================================ */
browseBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fileInput.click(); });
dropZone.addEventListener('click', (e) => {
    if (!state.file && e.target !== browseBtn && !btnRemove.contains(e.target)) fileInput.click();
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) loadSingleFile(e.target.files[0]);
});

dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadSingleFile(file);
});

function loadSingleFile(file) {
    state.file = file;
    dropContent.style.display = 'none';
    dropPreview.style.display = 'flex';

    previewName.textContent = file.name;
    previewMeta.textContent = `${formatSize(file.size)} · ${file.type || 'unknown type'}`;

    previewWrap.innerHTML = '';
    const type = file.type;
    if (type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Preview'; previewWrap.appendChild(img);
    } else if (type.startsWith('video/')) {
        const vid = document.createElement('video');
        vid.src = URL.createObjectURL(file);
        vid.controls = false; vid.muted = true; vid.autoplay = true; vid.loop = true;
        previewWrap.appendChild(vid);
    } else {
        previewWrap.innerHTML = '<div class="audio-icon">🎵</div>';
    }

    updateAnalyzeButtonState();
}

function clearSingleFile() {
    state.file = null;
    fileInput.value = '';
    dropContent.style.display = 'flex';
    dropPreview.style.display = 'none';
    previewWrap.innerHTML = '';
    updateAnalyzeButtonState();
}

btnRemove.addEventListener('click', (e) => { e.stopPropagation(); clearSingleFile(); });

/* ============================================================
   FILE HANDLING: CROSS-MODAL (VIDEO + AUDIO)
   ============================================================ */
browseBtnVideo.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fileInputVideo.click(); });
dropZoneVideo.addEventListener('click', (e) => {
    if (!state.videoFile && e.target !== browseBtnVideo && !btnRemoveVideo.contains(e.target)) fileInputVideo.click();
});
fileInputVideo.addEventListener('change', (e) => {
    if (e.target.files[0]) loadCrossVideo(e.target.files[0]);
});
dropZoneVideo.addEventListener('dragover', (e) => { e.preventDefault(); dropZoneVideo.classList.add('drag-over'); });
dropZoneVideo.addEventListener('dragleave', () => dropZoneVideo.classList.remove('drag-over'));
dropZoneVideo.addEventListener('drop', (e) => {
    e.preventDefault(); dropZoneVideo.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadCrossVideo(file);
});

function loadCrossVideo(file) {
    state.videoFile = file;
    dropContentVideo.style.display = 'none';
    dropPreviewVideo.style.display = 'flex';
    previewNameVideo.textContent = file.name;
    previewMetaVideo.textContent = `${formatSize(file.size)} · ${file.type || 'video'}`;

    previewWrapVideo.innerHTML = '';
    const vid = document.createElement('video');
    vid.src = URL.createObjectURL(file);
    vid.muted = true; vid.autoplay = true; vid.loop = true;
    previewWrapVideo.appendChild(vid);
    updateAnalyzeButtonState();
}

btnRemoveVideo.addEventListener('click', (e) => {
    e.stopPropagation();
    state.videoFile = null;
    fileInputVideo.value = '';
    dropContentVideo.style.display = 'flex';
    dropPreviewVideo.style.display = 'none';
    previewWrapVideo.innerHTML = '';
    updateAnalyzeButtonState();
});

// Audio handlers
browseBtnAudio.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fileInputAudio.click(); });
dropZoneAudio.addEventListener('click', (e) => {
    if (!state.audioFile && e.target !== browseBtnAudio && !btnRemoveAudio.contains(e.target)) fileInputAudio.click();
});
fileInputAudio.addEventListener('change', (e) => {
    if (e.target.files[0]) loadCrossAudio(e.target.files[0]);
});
dropZoneAudio.addEventListener('dragover', (e) => { e.preventDefault(); dropZoneAudio.classList.add('drag-over'); });
dropZoneAudio.addEventListener('dragleave', () => dropZoneAudio.classList.remove('drag-over'));
dropZoneAudio.addEventListener('drop', (e) => {
    e.preventDefault(); dropZoneAudio.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadCrossAudio(file);
});

function loadCrossAudio(file) {
    state.audioFile = file;
    dropContentAudio.style.display = 'none';
    dropPreviewAudio.style.display = 'flex';
    previewNameAudio.textContent = file.name;
    previewMetaAudio.textContent = `${formatSize(file.size)} · ${file.type || 'audio'}`;
    updateAnalyzeButtonState();
}

btnRemoveAudio.addEventListener('click', (e) => {
    e.stopPropagation();
    state.audioFile = null;
    fileInputAudio.value = '';
    dropContentAudio.style.display = 'flex';
    dropPreviewAudio.style.display = 'none';
    updateAnalyzeButtonState();
});

function clearAllFiles() {
    clearSingleFile();
    state.videoFile = null;
    state.audioFile = null;
    fileInputVideo.value = '';
    fileInputAudio.value = '';
    dropContentVideo.style.display = 'flex';
    dropPreviewVideo.style.display = 'none';
    previewWrapVideo.innerHTML = '';
    dropContentAudio.style.display = 'flex';
    dropPreviewAudio.style.display = 'none';
}

function updateAnalyzeButtonState() {
    if (state.mediaType === 'cross') {
        const isReady = !!(state.videoFile && state.audioFile);
        btnAnalyze.disabled = !isReady;
        btnAnalyze.style.opacity = isReady ? '1' : '0.4';
        btnAnalyzeText.textContent = isReady ? 'Analyze Cross-Modal Pair' : 'Upload Video & Audio';
    } else {
        const isReady = !!state.file;
        btnAnalyze.disabled = !isReady;
        btnAnalyze.style.opacity = isReady ? '1' : '0.4';
        btnAnalyzeText.textContent = 'Analyze Media';
    }
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/* ============================================================
   ANALYSIS TRIGGER
   ============================================================ */
btnAnalyze.addEventListener('click', startAnalysis);

async function startAnalysis() {
    if (state.mediaType === 'cross') {
        if (!state.videoFile || !state.audioFile) return;
    } else {
        if (!state.file) return;
    }

    btnAnalyze.disabled = true;
    btnAnalyzeText.textContent = 'Running Forensics...';

    pipelineSection.style.display = 'block';
    resultsSection.style.display = 'none';
    logBody.innerHTML = '';
    pipelineStages.innerHTML = '';
    verdictCard.className = 'verdict-card';
    evidenceGrid.innerHTML = '';
    signalBars.innerHTML = '';
    metaGrid.innerHTML = '';

    pipelineSubtext.textContent = state.mediaType === 'cross'
        ? 'Fusing Video & Audio stream signals in real time...'
        : 'Multimodal forensic scan in progress...';

    setTimeout(() => pipelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    // Render stage cards
    const stages = PIPELINE_STAGES[state.mediaType];
    stages.forEach(s => {
        pipelineStages.innerHTML += `
      <div class="stage-card" id="stage-${s.id}">
        <div class="stage-header">
          <span class="stage-icon">${s.icon}</span>
          <div>
            <div class="stage-name">${s.name}</div>
            <div class="stage-status" id="status-${s.id}">Waiting...</div>
          </div>
        </div>
        <div class="stage-bar"><div class="stage-bar-fill" id="fill-${s.id}"></div></div>
      </div>`;
    });

    // Pick profile outcome
    const outcome = Math.random() > 0.4 ? 'fake' : 'real';
    const profile = ANALYSIS_PROFILES[state.mediaType][outcome];
    const logs = LOG_MESSAGES[state.mediaType];

    for (let i = 0; i < stages.length; i++) {
        const s = stages[i];
        const card = $(`stage-${s.id}`);
        const fillEl = $(`fill-${s.id}`);
        const statusEl = $(`status-${s.id}`);

        card.classList.add('active');
        statusEl.textContent = 'Processing...';
        statusEl.style.color = 'var(--cyan)';

        const logIdx = Math.floor(i * 2);
        if (logs[logIdx]) await appendLog(logs[logIdx]);
        await sleep(220);
        if (logs[logIdx + 1]) await appendLog(logs[logIdx + 1]);

        await animateBar(fillEl, 0, 100, 500);

        card.classList.remove('active');
        card.classList.add('done');
        statusEl.textContent = '✓ Complete';
        statusEl.style.color = 'var(--green)';
        await sleep(100);
    }

    await appendLog(logs[logs.length - 1], 'success');
    await sleep(400);

    state.lastProfile = profile;
    btnAnalyze.disabled = false;
    btnAnalyzeText.textContent = state.mediaType === 'cross' ? 'Analyze Cross-Modal Pair' : 'Analyze Media';

    showResults(profile, outcome);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function animateBar(el, from, to, duration) {
    const start = performance.now();
    return new Promise(resolve => {
        function frame(now) {
            const t = Math.min((now - start) / duration, 1);
            el.style.width = (from + (to - from) * (1 - Math.pow(1 - t, 3))) + '%';
            if (t < 1) requestAnimationFrame(frame);
            else resolve();
        }
        requestAnimationFrame(frame);
    });
}

async function appendLog(msg, cls = '') {
    const line = document.createElement('div');
    line.className = 'log-line ' + (cls || detectLogClass(msg));
    const ts = new Date().toISOString().substring(11, 23);
    line.textContent = `${ts} ${msg}`;
    logBody.appendChild(line);
    logBody.scrollTop = logBody.scrollHeight;
    await sleep(60);
}

function detectLogClass(msg) {
    if (msg.includes('[SUCCESS]')) return 'success';
    if (msg.includes('[WARN]')) return 'warn';
    if (msg.includes('[ERROR]')) return 'error';
    if (msg.includes('[INFO]')) return 'info';
    return '';
}

/* ============================================================
   SHOW RESULTS
   ============================================================ */
function showResults(profile, outcome) {
    resultsSection.style.display = 'block';
    setTimeout(() => resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    verdictCard.className = `verdict-card ${profile.verdictClass}`;
    verdictIcon.textContent = profile.icon;
    verdictValue.textContent = profile.verdict;
    verdictValue.className = `verdict-value ${profile.verdictClass}`;

    verdictBadges.innerHTML = profile.badges
        .map(b => `<span class="verdict-badge ${b.cls}">${b.label}</span>`)
        .join('');

    drawGauge(profile.score, profile.verdictClass);
    scorePct.textContent = Math.round(profile.score * 100) + '%';
    scorePct.style.color = getColorForClass(profile.verdictClass);

    evidenceGrid.innerHTML = '';
    profile.evidence.forEach((ev, i) => {
        const card = document.createElement('div');
        card.className = 'evidence-card';
        card.style.animationDelay = `${i * 0.08}s`;
        card.innerHTML = `
      <div class="ev-header">
        <div class="ev-icon">${ev.icon}</div>
        <div>
          <div class="ev-title">${ev.title}</div>
          <div class="ev-type ${ev.type}">${ev.typeLabel}</div>
        </div>
      </div>
      <div class="ev-desc">${ev.desc}</div>
      <div class="ev-confidence">
        <span style="color:var(--text-muted)">Confidence</span>
        <div class="ev-conf-bar">
          <div class="ev-conf-fill ${ev.type}" style="width:0%" data-target="${Math.round(ev.confidence * 100)}%"></div>
        </div>
        <span style="color:${ev.type === 'danger' ? 'var(--red)' : ev.type === 'warn' ? 'var(--orange)' : 'var(--green)'}">
          ${Math.round(ev.confidence * 100)}%
        </span>
      </div>`;
        evidenceGrid.appendChild(card);
    });

    setTimeout(() => {
        document.querySelectorAll('.ev-conf-fill').forEach(el => {
            el.style.width = el.dataset.target;
        });
    }, 250);

    signalBars.innerHTML = '';
    profile.signals.forEach((sig) => {
        const row = document.createElement('div');
        row.className = 'signal-row';
        row.innerHTML = `
      <span class="signal-name">${sig.name}</span>
      <div class="signal-track">
        <div class="signal-fill ${sig.cls}" style="width:0%" data-target="${Math.round(sig.val * 100)}%"></div>
      </div>
      <span class="signal-val" style="color:${sig.cls === 'high' ? 'var(--red)' : sig.cls === 'medium' ? 'var(--orange)' : 'var(--green)'}">
        ${Math.round(sig.val * 100)}%
      </span>`;
        signalBars.appendChild(row);
    });

    setTimeout(() => {
        document.querySelectorAll('.signal-fill').forEach(el => {
            el.style.width = el.dataset.target;
        });
    }, 350);

    // Metadata cards
    const meta = buildMetadata();
    metaGrid.innerHTML = meta.map(m => `
    <div class="meta-item">
      <div class="meta-key">${m.key}</div>
      <div class="meta-value">${m.value}</div>
    </div>`).join('');

    $('btnNewAnalysis').onclick = resetToUpload;
    $('btnExport').onclick = exportReport;
}

function drawGauge(score, cls) {
    const canvas = $('scoreGauge');
    const ctx = canvas.getContext('2d');
    const cx = 70, cy = 70, r = 55;
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;
    const totalArc = endAngle - startAngle;
    const fillArc = totalArc * score;

    ctx.clearRect(0, 0, 140, 140);

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, 0, 140, 140);
    if (cls === 'fake') { grad.addColorStop(0, '#ff4d6d'); grad.addColorStop(1, '#ff9f43'); }
    else if (cls === 'likely-fake') { grad.addColorStop(0, '#ff9f43'); grad.addColorStop(1, '#ffd166'); }
    else if (cls === 'uncertain') { grad.addColorStop(0, '#ffd166'); grad.addColorStop(1, '#00b4ff'); }
    else { grad.addColorStop(0, '#00ffc8'); grad.addColorStop(1, '#00d68f'); }

    let current = startAngle;
    const step = fillArc / 50;
    const interval = setInterval(() => {
        current = Math.min(current + step, startAngle + fillArc);
        ctx.clearRect(0, 0, 140, 140);
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, current);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.stroke();

        if (current >= startAngle + fillArc) clearInterval(interval);
    }, 16);
}

function getColorForClass(cls) {
    return { fake: 'var(--red)', 'likely-fake': 'var(--orange)', uncertain: 'var(--yellow)', real: 'var(--green)' }[cls] || 'var(--cyan)';
}

function buildMetadata() {
    const now = new Date();
    if (state.mediaType === 'cross') {
        return [
            { key: 'Modality Mode', value: 'Cross-Modal (Video + Audio Fusion)' },
            { key: 'Video Stream', value: state.videoFile ? `${state.videoFile.name} (${formatSize(state.videoFile.size)})` : 'N/A' },
            { key: 'Audio Stream', value: state.audioFile ? `${state.audioFile.name} (${formatSize(state.audioFile.size)})` : 'N/A' },
            { key: 'Analysis Time', value: now.toLocaleTimeString() },
            { key: 'Engine Version', value: 'DeepSentinel v3.1 Cross-Fusion' },
            { key: 'Models Deployed', value: 'SyncNet + AV-Hubert + AASIST v2' },
            { key: 'AV Latency Window', value: '±250ms Temporal Search' },
            { key: 'Alignment Method', value: 'Phoneme-Viseme Cross-Correlation' }
        ];
    }

    const file = state.file;
    const ext = file ? file.name.split('.').pop().toUpperCase() : 'UNKNOWN';
    return [
        { key: 'Filename', value: file ? file.name : 'N/A' },
        { key: 'File Type', value: file ? (file.type || ext) : 'N/A' },
        { key: 'File Size', value: file ? formatSize(file.size) : 'N/A' },
        { key: 'Analysis Time', value: now.toLocaleTimeString() },
        { key: 'Engine Version', value: 'DeepSentinel v2.4.1' },
        { key: 'Modality', value: state.mediaType.toUpperCase() },
        { key: 'Models Used', value: state.mediaType === 'audio' ? 'AASIST v2 + HiFi-Guard' : 'EfficientNet-B7 + FaceForensics++' },
        { key: 'Pipeline', value: 'Unimodal Neural Feature Extraction' },
    ];
}

/* ============================================================
   RESET & EXPORT
   ============================================================ */
function resetToUpload() {
    pipelineSection.style.display = 'none';
    resultsSection.style.display = 'none';
    clearAllFiles();
    $('upload').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function exportReport() {
    const profile = state.lastProfile;
    if (!profile) return;

    const now = new Date().toISOString();
    const isCross = state.mediaType === 'cross';

    const fileDetails = isCross
        ? `Video File:    ${state.videoFile ? state.videoFile.name : 'N/A'}\nAudio File:    ${state.audioFile ? state.audioFile.name : 'N/A'}`
        : `Input File:    ${state.file ? state.file.name : 'N/A'}\nFile Size:     ${state.file ? formatSize(state.file.size) : 'N/A'}`;

    const evidenceLines = profile.evidence
        .map((ev, i) => `  ${i + 1}. [${ev.typeLabel}] ${ev.title}\n     ${ev.desc}\n     Confidence: ${Math.round(ev.confidence * 100)}%`)
        .join('\n\n');

    const signalLines = profile.signals
        .map(s => `  ${s.name.padEnd(32)} ${Math.round(s.val * 100)}%`)
        .join('\n');

    const reportText = [
        '============================================================',
        '  DEEPSENTINEL — MULTIMODAL FORENSIC ANALYSIS REPORT',
        '  HackNex 2026 | Problem 10 | Multimodal Deepfake Detection',
        '============================================================',
        '',
        fileDetails,
        `Mode:          ${isCross ? 'CROSS-MODAL (VIDEO + AUDIO FUSION)' : state.mediaType.toUpperCase()}`,
        `Timestamp:     ${now}`,
        `Engine:        DeepSentinel v3.1 Fusion Core`,
        '',
        '------------------------------------------------------------',
        `VERDICT:        ${profile.verdict}`,
        `FAKE SCORE:     ${Math.round(profile.score * 100)}%`,
        `CONFIDENCE:     ${profile.score > 0.8 ? 'HIGH' : profile.score > 0.5 ? 'MEDIUM' : 'LOW'}`,
        '------------------------------------------------------------',
        '',
        'FORENSIC EVIDENCE FINDINGS:',
        '',
        evidenceLines,
        '',
        '------------------------------------------------------------',
        'EXTRACTED SIGNAL INTEGRITY:',
        '',
        signalLines,
        '',
        '============================================================',
        '  Automated report produced by DeepSentinel Forensics Suite.',
        '============================================================',
    ].join('\n');

    const blob = new Blob([reportText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `deepsentinel_${state.mediaType}_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
}

/* ============================================================
   INITIALIZATION
   ============================================================ */
updateDropHint();
