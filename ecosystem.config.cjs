// PM2 ecosystem config — used on the production server
// Run: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'babos-kitchen',
      script: 'dist-server/index.js',
      cwd: '/home/babos.jaiveeru.site/public_html',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      restart_delay: 3000,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
  ],
};
