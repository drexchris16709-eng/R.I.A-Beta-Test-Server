        const validCredentials = {
            "b233": { passkey: "fg8890", redirect: "../TestAccount/Test1.html" },
            "user2": { passkey: "secret5678", redirect: "dashboard2.html" },
            "admin": { passkey: "adminpass99", redirect: "admin.html" },
            "cotcots": { passkey: "devpass2026", redirect: "developer.html" },
            "alpha": { passkey: "keyalpha11", redirect: "alpha.html" },
            "beta": { passkey: "keybeta22", redirect: "beta.html" }
        };

        function togglePasswordVisibility() {
            const passInput = document.getElementById('passkeyInput');
            const eyeSlash = document.getElementById('eyeSlash');
            
            if (passInput.type === 'password') {
                passInput.type = 'text';
                eyeSlash.classList.add('active');
            } else {
                passInput.type = 'password';
                eyeSlash.classList.remove('active');
            }
        }

        function handleLogin(event) {
            event.preventDefault();

            const userId = document.getElementById('userIdInput').value.trim().toLowerCase();
            const passkey = document.getElementById('passkeyInput').value.trim();
            const errorText = document.getElementById('errorText');

            errorText.classList.add('hidden');

            if (validCredentials[userId] && validCredentials[userId].passkey === passkey) {
                const modal = document.getElementById('loadingModal');
                const loadingText = document.getElementById('loadingText');
                loadingText.textContent = "Logging in...";
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.remove('opacity-0'), 10);

                setTimeout(() => {
                    window.location.href = validCredentials[userId].redirect;
                }, 1400);

            } else {
                errorText.classList.remove('hidden');
                shakeForm();
            }
        }

        function shakeForm() {
            const form = document.getElementById('loginForm');
            form.classList.add('animate-pulse');
            setTimeout(() => form.classList.remove('animate-pulse'), 400);
        }

        function handleBack() {
            document.getElementById('loginForm').reset();
            document.getElementById('errorText').classList.add('hidden');
            
            if (window.history.length > 1) {
                window.history.back();
            } else {
                const backBtn = document.querySelector('.desktop-back-wrapper button');
                backBtn.style.transform = 'scale(0.95)';
                setTimeout(() => backBtn.style.transform = 'scale(1)', 150);
            }
        }
