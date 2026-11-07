# Deployment status

This checkout is currently a local-only preview. It does not include a working sign-in, database, storage, or account authorization integration, so it is not ready to deploy as a production tuition platform.

The SQL and migration files under `supabase/` are preserved as reference material only. They are not applied automatically and this project does not connect to the existing hosted database. Do not treat this preview as providing account security or saved data.

Before production deployment, restore and review authentication, authorization, persistent storage, private video access, webhook verification, and the corresponding environment configuration. None of those integrations were verified against a hosted service by this local-preview repair.
