const invokeUrl = "https://iu9fj463h9.execute-api.us-east-1.amazonaws.com/prod"; // the invoke URL for the deployed API gateway

const conversionRate = {
  "Car Ride": 0.4, // made up values
  "Flight": 0.15,
  "Train Ride": 0.07
};

function convertCarbon() {
  const activity = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  const factor = conversionRate[activity];
  const carbon = quantity * factor;

  document.getElementById("output").textContent = `Your carbon: ${carbon} kg CO₂`;
  return carbon;
}

async function writeRecord() {
  const user = document.getElementById("user").value;
  const activity = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);
  const carbon = convertCarbon();

  const resp = await fetch(invokeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "write", user, activity, quantity, carbon })
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