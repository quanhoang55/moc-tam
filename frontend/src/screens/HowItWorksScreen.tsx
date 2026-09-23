import { useLocalForm } from "../hooks/useLocalForm";

const NEWSLETTER_FIELDS = [
  { id: "newsletter-email", required: true, email: true, error: "This field is required" },
];

export function HowItWorksScreen() {
  const { errors, message, handleSubmit } = useLocalForm("You're on the list.");
  const emailError = errors["newsletter-email"];

  return (
    <>
      <section className="how-content">
        <div className="narrow-page">
          <h1>How It Works</h1>
          <div className="rte">
            <h2>The Mộc Tâm Tea Ritual</h2>
            <p>
              Four-Herb Raspberry Leaf Tea turns a few quiet minutes each day into a warm,
              restful moment. Whether you've just finished a long day or simply want to
              pause for a while, the ritual stays simple, gentle, and yours.
            </p>
            <h2>Three Simple Steps</h2>
            <h3>1. Warm the Teapot</h3>
            <p>
              Rinse the pot with hot water and prepare water at around 85–90°C. Add the
              amount of tea that suits your taste.
            </p>
            <h3>2. Steep the Tea</h3>
            <p>
              Cover and wait <strong>3–5 minutes</strong> for the leaves to release their
              aroma. Mộc Tâm tea leaves are carefully selected to keep their smooth,
              natural flavor.
            </p>
            <h3>3. Enjoy for About 10 Minutes</h3>
            <p>
              Pour the tea, breathe in the aroma, and savor it slowly for{" "}
              <strong>about 10 quiet minutes</strong>. Let the day's stress settle with
              every warm sip.
            </p>
            <h2>Made for Your Life</h2>
            <p>
              Whether you're busy or just looking for a quiet moment of your own, the Mộc
              Tâm ritual is a simple way to slow down and feel better. With natural flavor,
              fresh packaging, and easy re-steeping, it's a calming moment you can return
              to any time.
            </p>
            <p>
              <em>
                Mộc Tâm tea is a beverage product, not a medicine or medical device, and is
                not intended to diagnose, treat, cure, or prevent any disease or condition.
              </em>
            </p>
          </div>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-wrapper">
          <h2>Subscribe to our emails</h2>
          <p>Join our email list for exclusive offers and the latest news from Mộc Tâm.</p>
          <form
            className="newsletter-form"
            onSubmit={(event) => handleSubmit(event, NEWSLETTER_FIELDS)}
          >
            <div
              className={`field-wrapper${emailError ? " field-wrapper--error" : ""}`}
            >
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email"
                aria-invalid={emailError ? true : undefined}
              />
              <label htmlFor="newsletter-email">Email</label>
              {emailError && <small className="field-error">{emailError}</small>}
            </div>
            <button type="submit">Sign up</button>
            <small className="local-form-message" aria-live="polite">
              {message}
            </small>
          </form>
        </div>
      </section>
    </>
  );
}
