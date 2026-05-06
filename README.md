# Multi-Client Website Template

This project now supports client-based customization from URL + JSON config.

## How it works

- Default site loads when no client is passed.
- Client-specific branding loads when URL has:
  - `/?client=client_key`
  - `/client=client_key`
- Data source: `public/clients.json`

## Create a new client

1. Open `public/clients.json`
2. Add a new key, for example:

```json
"new_client": {
  "name": "New Client Studio",
  "tagline": "Create. Capture. Convert.",
  "description": "Short SEO/meta description.",
  "phone": "+91-90000-00000",
  "email": "hello@newclient.com",
  "address": "Full address here",
  "founderName": "Founder Name",
  "founderRole": "Founder",
  "founderImage": "/media/owner_photo.png",
  "heroSubtitle": "End-to-end production, from concept to final edit.",
  "aboutLine1": "About paragraph line 1",
  "aboutLine2": "About paragraph line 2",
  "aboutLine3": "About paragraph line 3",
  "social": {
    "whatsapp": "https://wa.me/919000000000",
    "instagram": "https://instagram.com/yourpage",
    "linkedin": "https://linkedin.com/company/yourpage",
    "youtube": "https://youtube.com/@yourchannel"
  }
}
```

3. Open in browser:
   - `http://localhost:5173/?client=new_client`

## What is already dynamic

- Brand name in navbar + metadata
- Hero subtitle
- Footer address, email, phone, map link
- Floating WhatsApp/Instagram links
- About section founder name, role, photo, and copy

## Notes

- Keep `client_key` URL-safe (snake_case preferred).
- If `social.whatsapp` is not set, it is auto-generated from `phone`.
