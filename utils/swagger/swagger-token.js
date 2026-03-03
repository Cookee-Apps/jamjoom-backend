window.addEventListener('load', function () {
  const tokenPath = ['/login', '/verify_otp'];
  const tokenMappings = {
    '/admin': 'AdminToken',
    '/store': 'StoreToken',
    '/customer': 'CustomerToken',
    '/driver': 'DriverToken',
  };
  const tokenKey = 'authorized';

  const presetTokens = JSON.parse(localStorage.getItem(tokenKey) || '{}');

  // Preload existing tokens into Swagger auth
  if (Object.keys(presetTokens).length) {
    window.ui.getSystem().authActions.authorize(presetTokens);
    console.log('✅ Swagger tokens restored from localStorage.');
  }

  function setupTokenInterceptor() {
    const ui = window.ui;
    const system = ui.getSystem();
    const originalExecute = system.fn.execute;

    system.fn.execute = function (req) {
      const result = originalExecute.call(this, req);
      const url = req.contextUrl || '';
      const path = req?.pathName || '';
      const isLogin = tokenPath.some((p) => path.includes(p));
      if (!isLogin) return result;

      result
        .then(function (response) {
          const token = response?.body?.token;
          if (!token) return;
          const tokenType = detectTokenType(url); // e.g. 'AdminToken'

          if (!tokenType) {
            console.warn('❌ Could not detect token type from path:', path);
            return;
          }

          const tokenObj = {
            name: tokenType,
            schema: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
            value: token,
          };

          const authorizedData = JSON.parse(
            localStorage.getItem(tokenKey) || '{}',
          );
          authorizedData[tokenType] = tokenObj;

          // Save in localStorage
          localStorage.setItem(tokenKey, JSON.stringify(authorizedData));

          // Save for Swagger auth
          system.authActions.authorize({ [tokenType]: tokenObj });

          console.log(`🔐 ${tokenType} token captured and applied.`);
        })
        .catch(() => {});

      return result;
    };
  }

  function detectTokenType(path) {
    for (const [key, value] of Object.entries(tokenMappings)) {
      if (path.includes(key)) return value;
    }
    return null;
  }

  function waitForSwaggerReady(callback, attempts = 0) {
    const MAX_ATTEMPTS = 10;
    if (window.ui?.getSystem?.().authActions) {
      callback();
    } else if (attempts < MAX_ATTEMPTS) {
      setTimeout(() => waitForSwaggerReady(callback, attempts + 1), 500);
    } else {
      console.warn('⚠️ Swagger UI not ready in time.');
    }
  }

  waitForSwaggerReady(setupTokenInterceptor);
});
