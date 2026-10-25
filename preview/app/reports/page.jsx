import { render } from "@react-email/components";
import EmailTemplate from "@/emails/template";
import { reportProps } from "../sample-data";

export default async function ReportPreview() {
  const html = await render(<EmailTemplate {...reportProps} />);

  return (
    <>
      <p className="preview-eyebrow">THE MONTH, MADE READABLE</p>
      <h1 className="preview-title">A financial recap, in your inbox.</h1>
      <p className="preview-description">
        The original monthly-report email template, rendered with fictional totals and
        handwritten example insights. This preview sends no email and makes no AI requests.
      </p>
      <iframe title="Monthly report email with sample data" className="preview-report" srcDoc={html} sandbox="" />
    </>
  );
}
