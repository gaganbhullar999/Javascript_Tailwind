const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";
const basicAuth = btoa('coalition:skills-test');

const createHealthChart = (chartData) => {
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [chartData.systolic, chartData.diastolic]
        },
        options: {
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

const fetchUserDetail = async () => {
    try {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: { 'Authorization': `Basic ${basicAuth}` },
            redirect: 'follow'
        });

        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        const patients = await res.json();
        const selectedPatient = patients.find((p) => p.name == "Jessica Taylor");
        if (selectedPatient) {
            let chartData = {
                labels: [],
                systolic: {
                    label: 'Systolic',
                    data: [],
                    borderWidth: 2,
                    lineTension: 0.5
                },
                diastolic: {
                    label: 'Diastolic',
                    data: [],
                    borderWidth: 2,
                    lineTension: 0.5
                }
            };

            for (let i = 0; i < 6; i++) {
                const record = selectedPatient.diagnosis_history[i];
                chartData.labels.unshift(`${record.month.substring(0, 3)}, ${record.year}`);
                chartData.systolic.data.unshift(record.blood_pressure.systolic.value);
                chartData.diastolic.data.unshift(record.blood_pressure.diastolic.value);
            }

            createHealthChart(chartData);

            for (const key in selectedPatient) {
                if (Object.hasOwnProperty.call(selectedPatient, key)) {
                    const ele = document.getElementById(key);
                    if (ele) {
                        let info = selectedPatient[key];
                        if (key === 'date_of_birth') {
                            const dateObj = moment(info);
                            info = dateObj.format("MMMM DD, YYYY");
                        }

                        if (key === "profile_picture") {
                            ele.src = info;
                        } else {
                            ele.innerText = info;
                        }
                    }
                }
            }
            document.getElementById("selected-patient").classList.remove("hidden");
        }
        document.getElementById("selected-patient-loader").classList.add("hidden");
        let listItem = document.getElementById("patient-list");
        patients.forEach(patient => {
            let html = `<div class="flex justify-between pr-4">
                <div class="flex gap-4 items-center cursor-pointer">
                    <img src="${patient.profile_picture}" class="w-[44px] h-[44px]" alt="profile" />
                    <div class="flex flex-col">
                        <p class="text-sm">${patient.name}</p>
                        <span class="text-sm text-gray-500">${patient.gender} ${patient.age}</span>
                    </div>
                </div>
                <img src="./assets/img/more_vert_FILL0_wght300_GRAD0_opsz24.svg" class="rotate-90 h-4" alt="more" />
            </div>`;
            
            listItem.insertAdjacentHTML('beforeend', html);
        });
        console.log({ patients, selectedPatient });
    } catch (err) {
        console.error(err);
    }
}

(function() {
    fetchUserDetail();
 })();