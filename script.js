 const API_URL = "http://dinner-trapped-culprit.ngrok-free.dev/api/project-filesX-Project-Key: 4DHmtwOy6GDle9altN7oLYRpQh99KOm7";
const API_KEY = "4DHmtwOy6GDle9altN7oLYRpQh99KOm7";

// رفع الملفات
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const uploadStatus = document.getElementById("uploadStatus");

uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (fileInput.files.length === 0) {
        uploadStatus.style.color = "red";
        uploadStatus.textContent = "الرجاء اختيار ملف أولاً!";
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    uploadStatus.style.color = "#3498db";
    uploadStatus.textContent = "جاري رفع الملف...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`
            },
            body: formData
        });

        if (response.ok) {
            uploadStatus.style.color = "green";
            uploadStatus.textContent = "تم رفع الملف بنجاح!";
            uploadForm.reset();
        } else {
            throw new Error("فشل الرفع من الخادم");
        }
    } catch (error) {
        uploadStatus.style.color = "red";
        uploadStatus.textContent = "حدث خطأ أثناء رفع الملف. تأكد من عمل الخادم.";
        console.error(error);
    }
});

// جلب وعرض البيانات من الـ API
const fetchDataBtn = document.getElementById("fetchDataBtn");
const dataTableBody = document.querySelector("#dataTable tbody");

fetchDataBtn.addEventListener("click", async () => {
    dataTableBody.innerHTML = `<tr><td colspan="2" class="no-data">جاري جلب البيانات...</td></tr>`;

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                dataTableBody.innerHTML = "";
                data.forEach((item, index) => {
                    dataTableBody.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${typeof item === 'object' ? JSON.stringify(item) : item}</td>
                        </tr>
                    `;
                });
            } else {
                dataTableBody.innerHTML = `<tr><td colspan="2" class="no-data">لا توجد بيانات متاحة حالياً.</td></tr>`;
            }
        } else {
            throw new Error("فشل في جلب البيانات");
        }
    } catch (error) {
        dataTableBody.innerHTML = `<tr><td colspan="2" class="no-data" style="color: red;">خطأ في الاتصال بالخادم أو جلب البيانات.</td></tr>`;
        console.error(error);
    }
});
