package com.example.usbhostcheck;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private UsbManager usbManager;
    private static final String ACTION_USB_PERMISSION = "com.example.usbhostcheck.USB_PERMISSION";
    private UsbDevice usbDevice;
    private UsbDeviceConnection usbConnection;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        TextView textView = findViewById(R.id.textView);
        usbManager = (UsbManager) getSystemService(Context.USB_SERVICE);

        // Check for USB Host Mode support
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_USB_HOST)) {
            textView.setText("✅ USB Host Mode is Supported!");

            // Get the connected USB device
            usbDevice = getConnectedUsbDevice();
            if (usbDevice != null) {
                requestUsbPermission(usbDevice);  // Request permission for the USB device
            } else {
                textView.setText("❌ No USB device detected!");
            }
        } else {
            textView.setText("❌ USB Host Mode is NOT Supported!");
        }
    }

    private UsbDevice getConnectedUsbDevice() {
        // Retrieve all connected USB devices
        for (UsbDevice device : usbManager.getDeviceList().values()) {
            // Here you can add additional logic to identify specific sensors by Vendor ID, Product ID, etc.
            if (device.getVendorId() == YOUR_SENSOR_VENDOR_ID) { // Replace with your sensor's vendor ID
                return device; // Return the USB sensor device
            }
        }
        return null; // No matching USB device found
    }

    private void requestUsbPermission(UsbDevice device) {
        PendingIntent permissionIntent = PendingIntent.getBroadcast(this, 0,
                new Intent(ACTION_USB_PERMISSION), 0);
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        registerReceiver(usbReceiver, filter);

        // Request permission to access the device
        usbManager.requestPermission(device, permissionIntent);
    }

    private final BroadcastReceiver usbReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (ACTION_USB_PERMISSION.equals(action)) {
                synchronized (this) {
                    UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
                        // Permission granted
                        establishUsbConnection(device);
                    } else {
                        // Permission denied
                        TextView textView = findViewById(R.id.textView);
                        textView.setText("❌ USB Permission Denied!");
                    }
                }
            }
        }
    };

    private void establishUsbConnection(UsbDevice device) {
        // Open the connection to the USB device
        usbConnection = usbManager.openDevice(device);

        if (usbConnection != null) {
            // Successfully connected to the USB device
            TextView textView = findViewById(R.id.textView);
            textView.setText("✅ USB Device Connected!");

            // Set up the interface and endpoint to communicate with the sensor
            UsbInterface usbInterface = device.getInterface(0); // Assuming interface 0 (adjust as needed)
            usbConnection.claimInterface(usbInterface, true);

            // Set up an endpoint for reading/writing data (e.g., bulk endpoint)
            UsbEndpoint endpoint = usbInterface.getEndpoint(0);  // Assuming endpoint 0 (adjust as needed)

            // Now you can start reading/writing data using the endpoint
            // You can implement your sensor data reading logic here.
        } else {
            TextView textView = findViewById(R.id.textView);
            textView.setText("❌ Failed to Connect to USB Device!");
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(usbReceiver); // Unregister the receiver when activity is destroyed
    }
}
