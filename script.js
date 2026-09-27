// Lấy các phần tử cần thiết trên trang qua id
const form = document.getElementById("prima-lead-form");
const leadName = document.getElementById("lead-name");
const leadPhone = document.getElementById("lead-phone");
const leadEmail = document.getElementById("lead-email");
const leadNote = document.getElementById("lead-note");

// Hiện lỗi cho 1 ô input cụ thể
function showError(input, message) {
    input.classList.add("input-error");
    document.getElementById(input.id + "Error").textContent = message;
}

// Xóa lỗi cho 1 ô input cụ thể
function clearError(input) {
    input.classList.remove("input-error");
    document.getElementById(input.id + "Error").textContent = "";
}

// Kiểm tra Họ và tên: không được để trống
function checkFullName() {
    const value = leadName.value.trim();

    if (value === "") {
        showError(leadName, "Vui lòng nhập họ và tên.");
        return false;
    }

    clearError(leadName);
    return true;
}

// Kiểm tra Số điện thoại: không được để trống, không chứa chữ cái, phải đủ 10 chữ số
function checkPhone() {
    const value = leadPhone.value.trim();

    if (value === "") {
        showError(leadPhone, "Vui lòng nhập số điện thoại.");
        return false;
    }

    // dùng regex thay vì isNaN để chắc chắn chỉ toàn chữ số, không lẫn chữ cái
    if (!/^[0-9]{10}$/.test(value)) {
        showError(leadPhone, "Số điện thoại phải bao gồm đúng 10 chữ số, không chứa chữ cái.");
        return false;
    }

    clearError(leadPhone);
    return true;
}

// Kiểm tra Email: không được để trống, đúng định dạng
function checkEmail() {
    const value = leadEmail.value.trim();

    if (value === "") {
        showError(leadEmail, "Vui lòng nhập email.");
        return false;
    }

    if (!/^[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}$/.test(value)) {
        showError(leadEmail, "Email không đúng định dạng.");
        return false;
    }

    clearError(leadEmail);
    return true;
}

// Nhu cầu quan tâm: không bắt buộc, chỉ xóa lỗi nếu có
function checkNote() {
    clearError(leadNote);
    return true;
}

// Chặn nhập chữ cái cho ô Số điện thoại ngay khi gõ, tự giới hạn 10 số
leadPhone.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
});

// Kiểm tra ngay khi người dùng click ra khỏi ô (không cần đợi bấm nút gửi)
leadName.addEventListener("blur", checkFullName);
leadPhone.addEventListener("blur", checkPhone);
leadEmail.addEventListener("blur", checkEmail);

// Xử lý khi bấm nút "Gửi yêu cầu tư vấn"
form.addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn form load lại trang

    // Gom tất cả hàm kiểm tra vào đây. Thêm ô mới thì thêm hàm vào mảng này.
    const valid = [checkFullName(), checkPhone(), checkEmail(), checkNote()].every(Boolean);

    // Nếu có lỗi thì dừng lại, không gửi dữ liệu đi
    if (!valid) {
        return;
    }

    var name = leadName.value.trim();
    var phone = leadPhone.value.trim();
    var email = leadEmail.value.trim();
    var note = leadNote.value.trim();

    var data = new FormData();
    data.append('entry.1521644140', name);   // Họ và tên
    data.append('entry.1525090336', phone);  // Số điện thoại
    data.append('entry.239557218', email);   // Email quý khách
    data.append('entry.414245279', note);    // Nhu cầu quan tâm

    fetch('https://docs.google.com/forms/d/e/1FAIpQLSdy2HBUU9Z6ylKGMaKQsMam_FrD08031WeGTYt4fZWIEdQG1g/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body: data
    }).then(function () {
        form.reset();
        document.querySelectorAll("#prima-lead-form input, #prima-lead-form textarea").forEach(clearError);
        alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.');
    }).catch(function () {
        alert('Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.');
    });
});