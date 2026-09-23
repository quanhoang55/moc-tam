import { useLocalForm, type LocalField } from "../hooks/useLocalForm";

const CONTACT_FIELDS: LocalField[] = [
  { id: "contact-email", required: true, email: true, error: "This field is required" },
];

export function ContactScreen() {
  const { errors, message, handleSubmit } = useLocalForm("Thanks — we'll be in touch.");
  const emailError = errors["contact-email"];

  return (
    <section className="contact-page">
      <h2>Get in touch</h2>
      <form className="contact-form" onSubmit={(event) => handleSubmit(event, CONTACT_FIELDS)}>
        <div className="contact-fields">
          <div className="field-wrapper">
            <input id="contact-name" type="text" name="contact[Name]" placeholder="Name" />
            <label htmlFor="contact-name">Name</label>
          </div>
          <div
            className={`field-wrapper${emailError ? " field-wrapper--error" : ""}`}
          >
            <input
              id="contact-email"
              type="email"
              name="contact[email]"
              placeholder="Email"
              aria-invalid={emailError ? true : undefined}
            />
            <label htmlFor="contact-email">Email</label>
            {emailError && <small className="field-error">{emailError}</small>}
          </div>
          <div className="field-wrapper full">
            <input
              id="contact-phone"
              type="tel"
              name="contact[Phone number]"
              placeholder="Phone number"
            />
            <label htmlFor="contact-phone">Phone number</label>
          </div>
          <div className="field-wrapper full textarea-wrapper">
            <textarea
              id="contact-comment"
              name="contact[Comment]"
              placeholder="Comment"
            ></textarea>
            <label htmlFor="contact-comment">Comment</label>
          </div>
        </div>
        <button className="contact-submit" type="submit">
          Send
        </button>
        <small className="local-form-message" aria-live="polite">
          {message}
        </small>
      </form>
    </section>
  );
}
