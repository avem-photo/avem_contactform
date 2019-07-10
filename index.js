const hbFormUrl = 'https://api.honeybook.com/api/v2/workspace/widget_inquiries';
const hbProxyUrl = 'https://cors-anywhere.herokuapp.com/';

// root instance
let avemContactForm = new Vue({
    el: '#avemContactForm',
    data: {
        contactForm: {
            vendor_id: '5ce600978a6d8a2fb9a4b840',
            vendor_name: 'Diane Lynn Lipski',
            contact_form_id: '5ce600988a6d8a2fb9a4bb43',
            company_id: '5ce600988a6d8a2fb9a4ba22',
            src_host: 'widget.honeybook.com',
            full_name: '',
            email: '',
            phone_number: '',
            event_type: '',
            event_date: '',
            event_location: '',
            event_guests: '',
            event_budget: '',
            event_details: ''
        },
        formReady: true,
        formSending: false,
        formSuccess: false
    },
    methods: {
        submitContactForm(){
            let self = this;

            self.formReady = false;
            self.formSending = true;

            setTimeout(function(){
                let dateSplit = self.contactForm.event_date.split('-');
                let formattedDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0].slice(2);
    
                self.contactForm.event_date = formattedDate;
    
                axios({
                    method: 'post',
                    url: self.hbProxyUrl + self.hbFormUrl,
                    data: self.contactForm
                }).then(
                    function(){
                        self.resetContactForm();
    
                        self.formSending = false;
                        self.formSuccess = true;
    
                        setTimeout(function(){
                            self.formSuccess = false;
                            self.formReady = true;
                        }, 2000);
                    }
                ).catch(
                    function(error){
                        console.error(error);

                        self.formSending = false;
                        self.formReady = true;
                    }
                );
            }, 2000);
        },
        getDefaultContactForm(){
            return {
                vendor_id: '5ce600978a6d8a2fb9a4b840',
                vendor_name: 'Diane Lynn Lipski',
                contact_form_id: '5ce600988a6d8a2fb9a4bb43',
                company_id: '5ce600988a6d8a2fb9a4ba22',
                src_host: 'widget.honeybook.com',
                full_name: '',
                email: '',
                phone_number: '',
                event_type: '',
                event_date: '',
                event_location: '',
                event_guests: '',
                event_budget: '',
                event_details: ''
            };
        },
        resetContactForm(){
            this.contactForm = this.getDefaultContactForm();
        }
    }
});