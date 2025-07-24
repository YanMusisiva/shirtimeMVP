export function getEmailContent(NameProduct: string) {
  const textVersion = `Hello,\n\nThank you for your interest in our product ${NameProduct}. We have received your request and will contact you within 7 to 10 minutes to finalize the details and ensure you can get this product in your hands.\n\nIn the meantime, feel free to visit our website to discover our other products.\n\nVisit us at: https://shirtime-mvp.vercel.app/`;

  const htmlVersion = `<div style="max-width: 480px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333333; padding: 24px;">
    <div style="text-align: center; margin-bottom: 20px;">
     <img 
  src="https://raw.githubusercontent.com/YanMusisiva/shirtimeMVP/refs/heads/main/public/logo.png"
  alt="Shirtime Logo"
  style="
    width: 80px; 
    height: 80px; 
    object-fit: cover; 
    border-radius: 50%; 
    background: #fff; 
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); 
    margin-bottom: 12px; 
    display: inline-block;"
/>

      <h2 style="font-size: 20px; color: #003087; margin: 0;">SHIRTIME CUSTOMER SERVICE</h2>
    </div>
    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
      Hello,<br><br>
      Thank you for your interest in our product <strong>${NameProduct}</strong>. We have received your request and will contact you within 7 to 10 minutes to finalize the details and ensure you can get this product in your hands.<br><br>
      In the meantime, feel free to visit our website to discover our other products.
    </p>
    <div style="text-align: center;">
      <a href="https://shirtime-mvp.vercel.app/" style="background-color: #0070ba; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-size: 16px; display: inline-block;">
        Shirtime Website
      </a>
    </div>
  </div>`;

  return {
    subject: NameProduct,
    text: textVersion,
    html: htmlVersion,
  };
}
