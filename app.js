$(document).ready(function () {
  const $button = $(".smart-button");
  const $form = $("#loginForm");
  let buttonAnimationFrame;

  $(document).on("mousemove", function (event) {
    // Cancel any existing animation frame
    if (buttonAnimationFrame) {
      cancelAnimationFrame(buttonAnimationFrame);
    }

    // Use requestAnimationFrame for smoother movement
    buttonAnimationFrame = requestAnimationFrame(() => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      $("#XC").text(mouseX);
      $("#YC").text(mouseY);

      const buttonOffset = $button.offset();
      const buttonX = buttonOffset.left + $button.width() / 2;
      const buttonY = buttonOffset.top;

      // Calculate mouse velocity
      const mouseDeltaX = mouseX - (window._lastMouseX || mouseX);
      const mouseDeltaY = mouseY - (window._lastMouseY || mouseY);
      window._lastMouseX = mouseX;
      window._lastMouseY = mouseY;

      const distance = calculateDistance(mouseX, mouseY, buttonX, buttonY);
      $("#DIS").text(distance);

      const $email = $("#login-email");
      const $password = $("#login-password");

      if ($email.val() !== "admin@gmail.com" || $password.val() !== "admin") {
        if (distance < 200) {
          // Increased detection range
          // Predict mouse position based on velocity
          const predictedMouseX = mouseX + mouseDeltaX * 2;
          const predictedMouseY = mouseY + mouseDeltaY * 2;

          // Calculate escape direction
          const escapeX = buttonX - predictedMouseX;
          const escapeY = buttonY - predictedMouseY;
          const escapeDistance = Math.sqrt(
            escapeX * escapeX + escapeY * escapeY
          );

          // Normalize escape vector and apply intensity
          const intensity = (200 - distance) * 0.15; // Increased movement intensity
          const escapeFactorX = (escapeX / escapeDistance) * intensity;
          const escapeFactorY = (escapeY / escapeDistance) * intensity;

          // Add slight randomization to movement
          const randomAngle = Math.random() * Math.PI * 2;
          const randomX = Math.cos(randomAngle) * 10;
          const randomY = Math.sin(randomAngle) * 10;

          $button.css({
            transform: `translate(
                            ${escapeFactorX * 8 + randomX}px,
                            ${escapeFactorY * 8 + randomY}px
                        )`,
            transition: "transform 0.1s ease-out", // Faster transition
          });
        } else {
          resetButtonStyle();
        }
      } else {
        resetButtonStyle();
      }
    });
  });

  $form.on("submit", function (e) {
    e.preventDefault();

    const emailValue = $("#login-email").val();
    const passwordValue = $("#login-password").val();

    if (emailValue === "admin@gmail.com" && passwordValue === "admin") {
      showAlert("success", "Sign in successful!");
      resetButtonStyle();
    } else {
      showAlert("error", "Invalid credentials. Please try again.");
      $("#login-email").addClass("is-invalid");
      $("#login-password").addClass("is-invalid");
    }
  });

  function showAlert(type, message) {
    const alertClass = type === "success" ? "alert-success" : "alert-danger";
    const alert = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    $(".card-body").prepend(alert);
    setTimeout(() => $(".alert").alert("close"), 3000);
  }

  function resetButtonStyle() {
    $button.css({
      transform: "translate(0, 0)",
      transition: "transform 0.3s ease-out",
    });
  }

  function calculateDistance(X, Y, x, y) {
    return Math.ceil(Math.sqrt((X - x) ** 2 + (Y - y) ** 2));
  }

  function calculatePerspectiveFactor(x, y) {
    const screenWidth = $(window).width();
    const screenHeight = $(window).height();
    const distanceFromCenter = Math.sqrt(
      (x - screenWidth / 2) ** 2 + (y - screenHeight / 2) ** 2
    );
    // Smoothed perspective factor
    return Math.min(
      1,
      1 -
        (distanceFromCenter /
          (Math.sqrt(screenWidth ** 2 + screenHeight ** 2) / 2)) *
          0.8
    );
  }

  // Cleanup animation frame on page unload
  $(window).on("unload", function () {
    if (buttonAnimationFrame) {
      cancelAnimationFrame(buttonAnimationFrame);
    }
  });

  // Add touch event handling for mobile devices
  $(document).on("touchmove", function (event) {
    const touch = event.touches[0];
    $(document).trigger("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  });
});
