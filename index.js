const hbFormUrl = 'https://api.honeybook.com/api/v2/workspace/widget_inquiries';
const hbProxyUrl = 'https://cors-anywhere.herokuapp.com/';

// root instance
let avemContactForm = new Vue({
    el: '#avemContactForm',
    components: {
        vuejsDatepicker
    },
    data: {
        attemptSubmit: false,
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
    computed: {
        invalidName: function(){
            return this.contactForm.full_name === '';
        },
        invalidEmail: function(){
            let missingValue = this.contactForm.email === '';
            let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let validEmail = emailRegEx.test(String(this.contactForm.email).toLowerCase());

            return missingValue || !validEmail;
        },
        invalidPhone: function(){
            let missingValue = this.contactForm.phone_number === '';
            let phoneRegEx = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
            let validPhone = phoneRegEx.test(String(this.contactForm.phone_number));

            return !missingValue && !validPhone;
        },
        invalidEventType: function(){
            return this.contactForm.event_type === '';
        },
        invalidEventDate: function(){
            let missingValue = this.contactForm.event_date === '';

            return !missingValue && !moment(this.contactForm.event_date).isValid();
        }
    },
    methods: {
        submitContactForm(){
            let self = this;
            let formattedForm = self.contactForm;

            self.formReady = false;
            self.formSending = true;

            setTimeout(function(){
                let dateSplit = moment(formattedForm.event_date).toArray();
                let formattedDate = (dateSplit[1] + 1).toString() + '/' + dateSplit[2].toString() + '/' + dateSplit[0].toString().slice(2);
    
                formattedForm.event_date = formattedDate;
                formattedForm.event_details = formattedForm.event_details + ' - Sent from avemphotography.com';
    
                axios({
                    method: 'post',
                    url: hbProxyUrl + hbFormUrl,
                    data: formattedForm
                }).then(
                    function(){
                        self.resetContactForm();
    
                        self.formSending = false;
                        self.formSuccess = true;
    
                        setTimeout(function(){
                            self.formSuccess = false;
                            self.formReady = true;
                            self.attemptSubmit = false;
                        }, 2000);
                    }
                ).catch(
                    function(error){
                        console.error(error);

                        self.formSending = false;
                        self.formReady = true;
                        self.attemptSubmit = false;
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
        },
        validateForm(evt){
            this.attemptSubmit = true;

            if (this.invalidName || this.invalidEmail || this.invalidPhone || this.invalidEventType || this.invalidEventDate){
                evt.preventDefault();
            }
            else {
                this.submitContactForm();
            }
        },
        missingValue: function(val){
            return !val.length;
        }
    }
});