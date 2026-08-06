// روابط الخادم ورابط الـ API للمشروع
const BASE_URL = "http://localhost:8080"; // يمكنك تغييرها برابط ngrok إن كنت تستخدمه للخادم المحلي
const PROJECT_FILES_URL = "http://dinner-trapped-culprit.ngrok-free.dev/api/project-files";
const PROJECT_KEY = "4DHmtwOy6GDle9altN7oLYRpQh99KOm7";

// 1. تسجيل الحساب وتسجيل الدخول (Auth)
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const signupBtn = document.getElementById("signupBtn");
const signinBtn = document.getElementById("signinBtn");
const authStatus = document.getElementById("authStatus");

async function handleAuth(actionType) {
    authStatus.style.color = "#3498db";
    authStatus.textContent = "جاري تنفيذ العملية...";

    try {
        const response = await fetch(`${BASE_URL}/api/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: actionType,
                email: authEmail.value,
                password: authPassword.value
            })
        });

        const data = await response.json();
        if (response.ok) {
            authStatus.style.color = "green";
            authStatus.textContent = `تم بنجاح! الاستجابة: ${JSON.stringify(data)}`;
        } else {
            throw new Error(data.message || "فشلت العملية");
        }
    } catch (error) {
        authStatus.style.color = "red";
        authStatus.textContent = "حدث خطأ: تأكد من تشغيل الخادم المحلي.";
        console.error(error);
    }
}

signupBtn.addEventListener("click", () => handleAuth("signup"));
signinBtn.addEventListener("click", () => handleAuth("signin"));


// 2. إنشاء قاعدة بيانات (Create Database)
const apiKeyInput = document.getElementById("apiKeyInput");
const dbNameInput = document.getElementById("dbNameInput");
const createDbBtn = document.getElementById("createDbBtn");
const dbStatus = document.getElementById("dbStatus");

// تعبئة مفتاح المشروع تلقائياً في الحقول التي تستخدمه
if (apiKeyInput) {
    apiKeyInput.value = PROJECT_KEY;
}

createDbBtn.addEventListener("click", async () => {
    dbStatus.style.color = "#3498db";
    dbStatus.textContent = "جاري إنشاء قاعدة البيانات...";

    try {
        const response = await fetch(`${BASE_URL}/api/db`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKeyInput.value || PROJECT_KEY
            },
            body: JSON.stringify({
                action: "create_database",
                database: dbNameInput.value
            })
        });

        if (response.ok) {
            dbStatus.style.color = "green";
            dbStatus.textContent = "تم إنشاء قاعدة البيانات بنجاح!";
        } else {
            throw new Error("فشل الإنشاء");
        }
    } catch (error) {
        dbStatus.style.color = "red";
        dbStatus.textContent = "حدث خطأ، تأكد من صحة الـ API Key.";
        console.error(error);
    }
});


// 3. إضافة مستند (Insert Document)
const insertDb = document.getElementById("insertDb");
const insertCollection = document.getElementById("insertCollection");
const insertDoc = document.getElementById("insertDoc");
const insertBtn = document.getElementById("insertBtn");
const insertStatus = document.getElementById("insertStatus");

insertBtn.addEventListener("click", async () => {
    insertStatus.style.color = "#3498db";
    insertStatus.textContent = "جاري إضافة المستند...";

    try {
        let parsedDoc = JSON.parse(insertDoc.value);
        const response = await fetch(`${BASE_URL}/api/db`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": apiKeyInput.value || PROJECT_KEY
            },
            body: JSON.stringify({
                action: "insert",
                database: insertDb.value,
                collection: insertCollection.value,
                document: parsedDoc
            })
        });

        if (response.ok) {
            insertStatus.style.color = "green";
            insertStatus.textContent = "تم إضافة المستند بنجاح!";
        } else {
            throw new Error("فشل الإضافة");
        }
    } catch (error) {
        insertStatus.style.color = "red";
        insertStatus.textContent = "خطأ: تأكد من صحة صيغة الـ JSON ومفتاح الـ API.";
        console.error(error);
    }
});


// 4. عرض المستندات (List Documents / Project Files) باستخدام الرابط الجديد
const listDb = document.getElementById("listDb");
const listCollection = document.getElementById("listCollection");
const listBtn = document.getElementById("listBtn");
const dataTableBody = document.querySelector("#dataTable tbody");

listBtn.addEventListener("click", async () => {
    dataTableBody.innerHTML = `<tr><td colspan="2" class="no-data">جاري جلب البيانات...</td></tr>`;

    try {
        // استخدام الرابط الجديد للمشروع مع رأس الطلب X-Project-Key
        const response = await fetch(PROJECT_FILES_URL, {
            method: "GET",
            headers: {
                "X-Project-Key": PROJECT_KEY,
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
                            <td><code>${typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</code></td>
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
        dataTableBody.innerHTML = `<tr><td colspan="2" class="no-data" style="color: red;">خطأ في الاتصال أو جلب البيانات. تأكد من أن رابط ngrok يعمل.</td></tr>`;
        console.error(error);
    }
});
