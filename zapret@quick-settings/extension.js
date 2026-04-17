import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {QuickToggle, SystemIndicator} from 'resource:///org/gnome/shell/ui/quickSettings.js';

const ZapretToggle = GObject.registerClass(
class ZapretToggle extends QuickToggle {
    _init() {
        super._init({
            label: 'Zapret',
            iconName: 'network-wireless-signal-excellent-symbolic',
            toggleMode: true,
        });
        
        this.label = 'Zapret';

        // Set initial toggle state
        this._checkServiceState();
        
        this.connect('clicked', () => {
            // The toggle hasn't changed state yet, so we want the opposite of current state
            const wantEnabled = !this.checked;
            this._setServiceState(wantEnabled);
        });
    }

    _checkServiceState() {
        try {
            const [success, stdout, stderr, status] = GLib.spawn_command_line_sync('systemctl is-active zapret.service');
            if (success) {
                const state = new TextDecoder().decode(stdout).trim();
                this.checked = (state === 'active');
            } else {
                this.checked = false;
            }
        } catch (e) {
            this.checked = false;
        }
    }

    _setServiceState(enable) {
        const action = !enable ? 'start' : 'stop';
        const command = ['pkexec', 'systemctl', action, 'zapret.service'];
        
        try {
            GLib.spawn_async(
                null,
                command,
                null,
                GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
                null,
                null
            );
            
            // Check state after a short delay
            GLib.timeout_add(GLib.PRIORITY_DEFAULT, 3500, () => {
                this._checkServiceState();
                return GLib.SOURCE_REMOVE;
            });
        } catch (e) {
            log('Zapret: Failed to toggle service: ' + e.message);
            // Revert the toggle if command failed
            this._checkServiceState();
        }
    }
});

export default class ZapretExtension {
    enable() {
        this._indicator = new SystemIndicator();
        this._toggle = new ZapretToggle();
        
        this._indicator.quickSettingsItems.push(this._toggle);
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
    }

    disable() {
        if (this._indicator) {
            this._indicator.quickSettingsItems.length = 0;
            this._indicator.destroy();
            this._indicator = null;
        }
        this._toggle = null;
    }
}
