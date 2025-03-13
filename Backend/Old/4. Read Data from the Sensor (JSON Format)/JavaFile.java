public void readDataFromSensor() {
    byte[] buffer = new byte[64]; // Adjust size based on expected data length
    int bytesRead;

    // Assume 'endpoint' is a Bulk IN endpoint that the sensor uses to send data
    UsbEndpoint endpoint = usbInterface.getEndpoint(0); // Endpoint for data reading
    bytesRead = usbConnection.bulkTransfer(endpoint, buffer, buffer.length, 1000); // Timeout set to 1000ms (1 second)

    if (bytesRead > 0) {
        // Convert byte array to JSON
        String jsonData = new String(buffer, 0, bytesRead, StandardCharsets.UTF_8);

        // Process JSON data
        processSensorData(jsonData);
    }
}
