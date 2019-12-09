import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerHelpOrderMail {
  get key() {
    return 'AnswerHelpOrderMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Resposta à sua pergunta da Academia GymPoint',
      template: 'AnswerHelpOrder',
      context: {
        studentName: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answerAt: format(
          parseISO(helpOrder.answer_at),
          "dd 'de' MMMM 'de' yyyy ', às' HH'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new AnswerHelpOrderMail();
