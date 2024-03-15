-- AddForeignKey
ALTER TABLE "quiz_response" ADD CONSTRAINT "quiz_response_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_response" ADD CONSTRAINT "quiz_response_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
