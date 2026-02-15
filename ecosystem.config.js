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
    ],
};
