// chain.js — Khi người dùng cuộn gần tới cuối trang, tự động tải nội dung
// trang kế tiếp (theo đúng thứ tự menu) và nối liền vào cuối trang hiện tại,
// tạo cảm giác một trang cuộn dài liên tục dù nội dung nằm ở nhiều file khác nhau.
//
// LƯU Ý: fetch() chỉ hoạt động khi web được host qua http/https (GitHub Pages,
// Netlify, hoặc chạy qua 1 local server). Nếu mở file bằng cách double-click
// (giao thức file://) trình duyệt sẽ chặn fetch giữa các file vì lý do bảo mật —
// khi đó menu và từng trang riêng lẻ vẫn hoạt động bình thường, chỉ riêng phần
// tự nối trang sẽ không chạy.

(function () {
    // Thứ tự các trang sẽ được nối tiếp nhau, đúng theo thứ tự menu
    var ORDER = [
        "index.html",
        "gioithieu.html",
        "tongquan.html",
        "matbang.html",
        "canho.html",
        "dientich.html",
        "giaban.html",
        "vitri.html"
    ];

    var main = document.getElementById("pageMain");
    var sentinel = document.getElementById("chainSentinel");
    if (!main || !sentinel || !("IntersectionObserver" in window)) {
        return; // môi trường không hỗ trợ, bỏ qua tính năng này
    }

    var currentFile = (location.pathname.split("/").pop() || "index.html");
    var idx = ORDER.indexOf(currentFile);
    if (idx === -1) idx = 0;

    var loading = false;
    var done = idx >= ORDER.length - 1;

    // Cập nhật menu đang active theo trang vừa được nối vào
    function setActiveNav(file) {
        document.querySelectorAll("#navMenu a").forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === file);
        });
    }

    // Tải trang kế tiếp, lấy đúng phần nội dung bên trong <main id="pageMain">
    // của trang đó rồi nối vào cuối <main> của trang hiện tại
    function loadNext() {
        if (loading || done) return;
        loading = true;

        var nextFile = ORDER[idx + 1];

        fetch(nextFile)
            .then(function (res) {
                if (!res.ok) throw new Error("Không tải được " + nextFile);
                return res.text();
            })
            .then(function (text) {
                var doc = new DOMParser().parseFromString(text, "text/html");
                var nextMain = doc.getElementById("pageMain");

                if (nextMain) {
                    var divider = document.createElement("div");
                    divider.className = "dawn-rule";
                    main.appendChild(divider);

                    // Chuyển toàn bộ nội dung con của trang kế tiếp vào trang hiện tại
                    while (nextMain.firstChild) {
                        main.appendChild(nextMain.firstChild);
                    }
                }

                idx++;
                history.replaceState(null, "", nextFile);
                setActiveNav(nextFile);
                if (doc.title) document.title = doc.title;

                if (idx >= ORDER.length - 1) {
                    done = true;
                    observer.disconnect();
                }
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(function () {
                loading = false;
            });
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) loadNext();
        });
    }, { rootMargin: "800px 0px" });

    observer.observe(sentinel);
})();
