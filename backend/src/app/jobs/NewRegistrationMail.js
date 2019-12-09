import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewRegistrationMail {
  get key() {
    return 'NewRegistrationMail';
  }

  async handle({ data }) {
    const formaterPrice = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });

    const { registration, plan, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Nova Matrícula no GymPoint',
      template: 'NewRegistration',
      context: {
        studentName: student.name,
        price: formaterPrice.format(Number(registration.price) / 100),
        planTitle: plan.title,
        planPrice: formaterPrice.format(Number(plan.price) / 100),
        planDuration: plan.duration,
        startDate: format(
          parseISO(registration.start_date),
          "dd 'de' MMMM 'de' yyyy ', às' HH'h'",
          {
            locale: pt,
          }
        ),
        endDate: format(
          parseISO(registration.end_date),
          "dd 'de' MMMM 'de' yyyy ', às' HH'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewRegistrationMail();
