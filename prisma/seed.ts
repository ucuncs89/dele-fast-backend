import { Media, PrismaClient, Product, Textbook } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const products: Product[] = [];
  const medias: Media[] = [];
  const textbooks: Textbook[] = [];
  const quizzess = [];
  const questions = [];
  const questionsAnswers = [];

  let quizIdCounter = 0;
  let questionIdCounter = 0;
  let answerIdCounter = 0;

  for (let qi = 1; qi <= 5; qi++) {
    const quiz = {
      name: faker.lorem.sentence(),
      created_at: new Date(),
      passing_grade: faker.helpers.rangeToNumber({ min: 50, max: 70 }),
      id: ++quizIdCounter,
      created_by: 0,
    };
    quizzess.push(quiz);

    for (let q = 1; q <= 5; q++) {
      const questionId = ++questionIdCounter;
      const question = {
        title: faker.lorem.sentence(),
        created_at: new Date(),
        quiz_id: qi,
        id: questionId,
        correct_answer: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
        created_by: 0,
      };
      questions.push(question);

      for (let i = 1; i < 6; i++) {
        const answerId = ++answerIdCounter;
        const answer = {
          choice: String.fromCharCode(64 + i), // 'A' + i,
          created_at: new Date(),
          question_id: questionId,
          created_by: 0,
          id: answerId,
          title: faker.color.human(),
        };
        questionsAnswers.push(answer);
      }
    }
  }
  for (let p = 1; p < 20; p++) {
    const product: Product = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseInt(faker.commerce.price({ min: 100000, max: 200000 })),
      type: faker.helpers.arrayElement(['QUIZ', 'MEDIA', 'TEXT']),
      created_at: new Date(),
      created_by: 0,
      id: p,
      relation_id: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
      is_deleted: false,
    };
    products.push(product);
  }
  for (let m = 1; m <= 5; m++) {
    const media: Media = {
      id: m,
      content: faker.lorem.lines(),
      file_url: faker.internet.url(),
    };
    medias.push(media);
  }
  for (let t = 1; t <= 5; t++) {
    const textbook: Media = {
      id: t,
      content: faker.lorem.lines(),
      file_url: faker.internet.url(),
    };
    textbooks.push(textbook);
  }

  await prisma.questionAnswers.deleteMany({});
  await prisma.questions.deleteMany({});
  await prisma.quiz.deleteMany({});

  await prisma.quiz.createMany({ data: quizzess });

  await prisma.questions.createMany({ data: questions });

  await prisma.questionAnswers.createMany({ data: questionsAnswers });

  await prisma.product.deleteMany({});
  await prisma.media.deleteMany({});
  await prisma.textbook.deleteMany({});

  await prisma.product.createMany({ data: products });

  await prisma.media.createMany({ data: medias });

  await prisma.textbook.createMany({ data: textbooks });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
