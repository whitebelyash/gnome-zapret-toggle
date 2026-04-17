## Zapret Toggle

Extremely simple vibecoded GNOME Shell extension which adds a toggle for controlling zapret systemd service. That's it.

Yes, it's a vibecoded slop. I had no time to properly learn js, gjs, glib/gobject and gnome-shell apis. It's for my personal usage anyway.

Did some manual fixes because the llm/slop generator I used refused to properly fix a stupid cringy bug. Also timeout was too small for systemd to stop the service (thus the toggle was working only after 2 clicks).

Supports gnome-shell 46-50.

#### Installation

Git clone the repo and drop extension directory onto extensions folder.
```bash
$ git clone https://github.com/whitebelyash/ZapretToggle && cd ZapretToggle
$ cp -rv zapret@quick-settings ~/.local/share/gnome-shell/extensions/
```
You're done.


#### YOU'RE A DUMBASS VIBECODER

shut up.
