# Azure architecture icons to PNG

This script converts an SVG image provided as Azure architecture icons to a PNG image. Generate and use PNG when SVG is not available, such as when you are using a version of Microsoft Office prior to 2016.

## Usage

1. Download Azure architecture icons.
    Go here and download the Azure architecture icons. Save the downloaded zip file to any location. Unless you are particular about it, we recommend that you place it in the same directory as this README.md.

2. Download the package.
    Run the following command to download the Node.js package.
    ```powershell
    npm install
    ```

3. Run the script.
    Execute the following command to perform the conversion.
    ```powershell
    node ./index.js
    # or
    node ./index.js --src ./Azure_Pulic_Service_Icons_V4.zip
    ```

    A PNG image is output to the dest folder as a result of execution the command.
