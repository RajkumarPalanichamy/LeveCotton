module.exports = {
    apps: [
        {
            name: 'leve-cottons',
            script: 'npm',
            args: 'start',
            env: {
                PORT: 3030,
                NODE_ENV: 'production',
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
        {
            name: 'supabase-keep-alive',
            script: './scripts/keep-supabase-warm.js',
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
