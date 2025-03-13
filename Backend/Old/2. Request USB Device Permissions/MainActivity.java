package com.example.usbhostcheck;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private UsbManager usbManager;
    private UsbDevice usbDevice;
    private static final String ACTION_USB_PERMISSION = "com.example.usbhostcheck.USB_PERMISSION";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        TextView textView = findViewById(R.id.textView);
        usbManager = (UsbManager) getSystemService(Context.USB_SERVICE);

        // Check if USB Host Mode is supported
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_USB_HOST)) {
            textView.setText("✅ USB Host Mode is Supported!");
            // Get the list of connected USB devices
            UsbDevice device = getConnectedUsbDevice();
            if (device != null) {
                // If a device is connected, request permission
                requestUsbPermission(device);
            } else {
                textView.setText("❌ No USB device detected!");
            }
        } else {
            textView.setText("❌ USB Host Mode is NOT Supported!");
        }
    }

    private UsbDevice getConnectedUsbDevice() {
        for (UsbDevice device : usbManager.getDeviceList().values()) {
            return device; // Return the first connected USB device found
        }
        return null; // No USB device connected
    }

    private void requestUsbPermission(UsbDevice device) {
        PendingIntent permissionIntent = PendingIntent.getBroadcast(this, 0,
                new Intent(ACTION_USB_PERMISSION), 0);
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        registerReceiver(usbReceiver, filter);

        // Request permission for the connected USB device
        usbManager.requestPermission(device, permissionIntent);
    }

    // BroadcastReceiver to handle USB permission results
    private final BroadcastReceiver usbReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_USB_PERMISSION.equals(action)) {
                synchronized (this) {
                    UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        // Permission granted to interact with the USB device
                        // Proceed with reading/writing data
                    } else {
                        // Permission denied
                        TextView textView = findViewById(R.id.textView);
                        textView.setText("❌ USB Permission Denied!");
                    }
                }
            }
        }
    };

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(usbReceiver); // Unregister the receiver when activity is destroyed
    }
}
