alter table "public"."interview" add column "difficulty" bigint;
alter table "public"."interview" drop column "minExpectedMonthlyIncome";
alter table "public"."interview" drop column "maxExpectedMonthlyIncome";


