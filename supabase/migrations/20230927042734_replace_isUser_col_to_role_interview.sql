CREATE TYPE roles AS ENUM ('user', 'assistant', 'system');

ALTER TABLE "public"."interview_message"
DROP COLUMN "isUser",
ADD COLUMN role roles NOT NULL DEFAULT 'user';

