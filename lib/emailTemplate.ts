export function getEmailContent(NameProduct: string) {
  return {
    subject: NameProduct,
    html: `<div style="max-width: 480px; margin: auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: Arial, sans-serif; color: #333333; padding: 24px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://github.com/YanMusisiva/shirtimeMVP/commit/ee64ff718a4fc166d53f1368ac8db6c236bb810a#diff-f3100c8706ee3ec644bb477fbb042c658005b02f8ebf3e87f699647d85f82ab6" alt="Logo" width="64" style="margin-bottom: 12px;" />
    <h2 style="font-size: 20px; color: #003087; margin: 0;">SHIRTIME SERVICE CLIENT</h2>
  </div>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
    Bonjour,<br><br>
    Merci de votre intérêt pour notre produit <strong>${NameProduct}</strong>. Nous avons bien reçu votre demande et nous vous contacterons dans 3 a 4 minutes pour finaliser les details et vous permetttre d'obtenir ce produit en mains .<br><br>
    En attendant, n'hésitez pas à consulter notre site web pour découvrir nos autres produits et services.
  </p>
  <div style="text-align: center;">
    <a href="https:" target="_blank" style="background-color: #0070ba; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-size: 16px; display: inline-block;">
      Shirtime Website
    </a>
  </div>
</div>`,
  };
}
