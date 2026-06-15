# Email Templates — Univibes

Provider : Resend
Expéditeur : noreply@univibes.com
Nom : Univibes

---

# Templates

## 1. Vérification Email

**Déclencheur** : Inscription

**Sujet** : Vérifiez votre adresse email — Univibes

**Contenu** :

```
Bonjour [Prénom],

Bienvenue sur Univibes !

Cliquez sur le bouton ci-dessous pour activer votre compte :

[Vérifier mon email]  ← lien avec token (valide 24h)

Si vous n'avez pas créé de compte, ignorez cet email.

L'équipe Univibes
```

**Expiration du lien** : 24 heures

---

## 2. Réinitialisation Mot de Passe

**Déclencheur** : POST /auth/forgot-password

**Sujet** : Réinitialisation de votre mot de passe — Univibes

**Contenu** :

```
Bonjour [Prénom],

Vous avez demandé à réinitialiser votre mot de passe.

Cliquez ici pour choisir un nouveau mot de passe :

[Réinitialiser mon mot de passe]  ← lien valide 1 heure

Si vous n'avez pas fait cette demande, ignorez cet email.
Votre mot de passe ne sera pas modifié.

L'équipe Univibes
```

**Expiration du lien** : 1 heure

---

## 3. Confirmation de Billet

**Déclencheur** : Paiement confirmé (webhook)

**Sujet** : Votre billet pour [Nom de l'événement] 🎟️

**Contenu** :

```
Bonjour [Prénom],

Votre achat est confirmé !

Événement : [Titre]
Date : [Date] à [Heure]
Lieu : [Lieu], [Ville]
Billet : [Type de billet]
Montant payé : [Montant] FCFA

Votre QR Code est disponible dans l'application sous "Mes Billets".

[Voir mon billet]

Bonne soirée !
L'équipe Univibes
```

---

## 4. Rappel Événement

**Déclencheur** : Job cron — la veille de l'événement à 08h00

**Sujet** : Rappel : [Nom de l'événement] c'est demain ! 🔔

**Contenu** :

```
Bonjour [Prénom],

On te rappelle que [Titre] c'est demain !

📅 [Date] à [Heure]
📍 [Lieu], [Ville]

N'oublie pas ton QR Code :

[Voir mon billet]

À demain !
L'équipe Univibes
```

---

## 5. Événement Validé (Organisateur)

**Déclencheur** : Modérateur approuve un événement

**Sujet** : Votre événement est en ligne ! ✅

**Contenu** :

```
Bonjour [Nom de l'organisation],

Bonne nouvelle ! Votre événement "[Titre]" vient d'être validé.

Il est maintenant visible par tous les étudiants sur Univibes.

[Voir mon événement]

Partagez-le sur vos réseaux pour maximiser la visibilité !

L'équipe Univibes
```

---

## 6. Événement Refusé (Organisateur)

**Déclencheur** : Modérateur refuse un événement

**Sujet** : Votre événement n'a pas été approuvé

**Contenu** :

```
Bonjour [Nom de l'organisation],

Votre événement "[Titre]" n'a pas été approuvé pour la raison suivante :

[Raison du refus]

Vous pouvez modifier votre événement et le soumettre à nouveau.

[Modifier mon événement]

L'équipe Univibes
```

---

## 7. Newsletter Hebdomadaire

**Déclencheur** : Cron job — chaque jeudi à 20h00

**Sujet** : 🎉 Les événements de la semaine sur ton campus

**Contenu** :

```
Salut [Prénom] 👋

Voici les événements de la semaine à [Ville] :

[Liste des 5 meilleurs événements avec image, titre, date]

[Tout explorer sur Univibes]

Bonne semaine !
L'équipe Univibes
```

---

# Implémentation

## Service d'envoi

```typescript
// notifications.service.ts
async sendVerificationEmail(user: User, token: string) {
  const verificationUrl = `${this.config.frontendUrl}/verify-email?token=${token}`;
  
  await this.resend.emails.send({
    from: 'Univibes <noreply@univibes.com>',
    to: user.email,
    subject: 'Vérifiez votre adresse email — Univibes',
    html: this.renderTemplate('verification', {
      name: user.fullname,
      verificationUrl,
    }),
  });
}
```

## Librairie de templates

Utiliser React Email (compatible Resend) pour des templates HTML modernes.

```bash
pnpm add react-email @react-email/components
```
