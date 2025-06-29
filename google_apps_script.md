
# Google Apps Script for Wallet Collection

Follow the instructions below to set up your Google Sheet as a backend.

## 1. Create Google Sheet & Open Script Editor

1.  Go to [sheets.new](https://sheets.new).
2.  Name the sheet something memorable (e.g., "Alkanes Wallets").
3.  In cell `A1`, type `Timestamp`.
4.  In cell `B1`, type `WalletAddress`.
5.  Click on `Extensions` > `Apps Script`.

## 2. Paste the Script

In the Apps Script editor, clear any existing code in the `Code.gs` file and paste the following script:

```javascript
function doPost(e) {
  // This function is triggered when a POST request is sent to the script's URL.

  try {
    // Parse the incoming data from the website's form.
    var data = JSON.parse(e.postData.contents);
    var walletAddress = data.wallet;

    // Basic validation: Ensure the wallet address is not empty.
    if (!walletAddress || walletAddress.trim() === "") {
      return ContentService
        .createTextOutput(JSON.stringify({ "status": "error", "message": "Wallet address cannot be empty." }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Get the active Google Sheet and the specific sheet named "Sheet1".
    // If you renamed your sheet, change "Sheet1" to match its name.
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

    // Append a new row with the current date and the submitted wallet address.
    sheet.appendRow([new Date(), walletAddress]);

    // Return a success message back to the website.
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "success", "message": "Wallet address saved." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // If any error occurs, log it for debugging and return an error message.
    Logger.log(error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": "An error occurred: " + error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Save and Deploy

1.  **Save the project:** Click the floppy disk icon (Save project). Name it something like "Alkanes Wallet Collector".
2.  **Deploy:**
    *   Click the blue **`Deploy`** button -> **`New deployment`**.
    *   Click the gear icon -> select **`Web app`**.
    *   **Description:** `V1`
    *   **Who has access:** Select **`Anyone`**. (This is crucial).
    *   Click **`Deploy`**.
3.  **Authorize:**
    *   Click **`Authorize access`** and choose your Google account.
    *   If you see a warning, click **`Advanced`** -> **`Go to [Your Project Name] (unsafe)`**.
    *   Click **`Allow`**.

## 4. Get the URL

After deployment, you will get a **Web app URL**. Please copy that URL and provide it to me.
