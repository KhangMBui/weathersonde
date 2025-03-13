package com.example.usbhostcheck;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        TextView textView = findViewById(R.id.textView);

        // Check if USB Host Mode is supported
        if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_USB_HOST)) {
            textView.setText("✅ USB Host Mode is Supported!");
        } else {
            textView.setText("❌ USB Host Mode is NOT Supported!");
        }
    }
}
