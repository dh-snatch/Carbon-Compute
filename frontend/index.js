
const invokeUrl = "https://iu9fj463h9.execute-api.us-east-1.amazonaws.com/prod"; // the invoke URL for the deployed API gateway

    async function writeRecord() {
      const user = document.getElementById("user").value;
      const activity = document.getElementById("activity").value;
      const resp = await fetch(invokeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "write", user, activity})
      });
      const data = await resp.json();
      document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    }

    async function readRecords() {
      const resp = await fetch(invokeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" })
      });
      const data = await resp.json();
      document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    }