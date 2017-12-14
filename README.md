## Troubleshooting
https://stackoverflow.com/questions/16748737/grunt-watch-error-waiting-fatal-error-watch-enospc
for foo in /proc/*/fd/*; do readlink -f $foo; done | grep inotify | sort | uniq -c | sort -nr
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
