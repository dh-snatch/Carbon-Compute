//const invokeUrl = "https://iu9fj463h9.execute-api.us-east-1.amazonaws.com/prod"; // the invoke URL for the deployed API gateway
// note this is not the actual URL, replace with your own from your deployed API gateway
// and don't commit your actual URL to a public repo

const invokeUrl = "https://j46crqzv4m.execute-api.us-east-1.amazonaws.com/prod";
// user ID to store in local storage, to track users without a login system
let userId = localStorage.getItem('userId');
if (!userId) {
  userId = 'user-' + Math.random().toString(36).substring(2, 12);
  localStorage.setItem('userId', userId);
}

console.log(userId);



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
  const user_id = localStorage.getItem('userId');
  const activity = document.getElementById("activity").value;
  const quantity = parseFloat(document.getElementById("quantity").value);
  const carbon = convertCarbon();

  const resp = await fetch(invokeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "write", user_id, activity, quantity, carbon })
  });
  const data = await resp.json();

  if (data.status === "ok") {
    document.getElementById("output").textContent = "Added record.";
  } else {
    document.getElementById("output").textContent = "Failed to add record.";
  }
}

async function readRecords() {
  const user_id = localStorage.getItem('userId');

  const resp = await fetch(invokeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read", user_id })
  });

  const data = await resp.json();

  if (data.status === "ok" && data.records) {
    const records = data.records;

    let table = `
      <table border="1" style="width: 90%; margin: 20px auto; border-collapse: collapse;">
        <tr>
          <th>Date</th>
          <th>Activity</th>
          <th>Quantity</th>
          <th>Carbon (kg CO₂)</th>
        </tr>`;



    records.forEach(record => {
      const date = record.key.split('/')[1].split('.')[0];
      const {activity, quantity, carbon } = record.data;
      table += `
        <tr>
          <td>${date}</td>
          <td>${activity}</td>
          <td>${quantity}</td>
          <td>${carbon}</td>
        </tr>`;
    });


    table += `</table>`;
    document.getElementById("output").innerHTML = table;
  } else {
    document.getElementById("output").textContent = "No records for this user.";
  }
}