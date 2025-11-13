 document.addEventListener('DOMContentLoaded', function() {
      const openFormBtn = document.getElementById('openFormBtn');
      const closeModalBtn = document.getElementById('closeModalBtn');
      const modalOverlay = document.getElementById('modalOverlay');
      const feedbackForm = document.getElementById('feedbackForm');
      const successAlert = document.getElementById('successAlert');
      const errorAlert = document.getElementById('errorAlert');
      
      const formFields = ['fullName', 'email', 'phone', 'organization', 'message', 'agreement'];
      
      openFormBtn.addEventListener('click', function() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        history.pushState({ modalOpen: true }, '', '#feedback-form');
  
        restoreFormData();
      });
      

      function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        isModalOpen = false;
    

      successAlert.style.display = 'none';
      errorAlert.style.display = 'none';

      if (window.location.hash === '#feedback-form') {
        history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
      
      closeModalBtn.addEventListener('click', closeModal);
      
      modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
      
      window.addEventListener('popstate', function(e) {
        if (modalOverlay.style.display === 'flex') {
          closeModal();
        }
      });
      
      function saveFormData() {
        const formData = {};
        formFields.forEach(fieldName => {
          const field = document.getElementById(fieldName);
          if (field) {
            if (field.type === 'checkbox') {
              formData[fieldName] = field.checked;
            } else {
              formData[fieldName] = field.value;
            }
          }
        });
        localStorage.setItem('feedbackFormData', JSON.stringify(formData));
      }
      
      function restoreFormData() {
        const savedData = localStorage.getItem('feedbackFormData');
        if (savedData) {
          try {
            const formData = JSON.parse(savedData);
            formFields.forEach(fieldName => {
              const field = document.getElementById(fieldName);
              if (field) {
                if (field.type === 'checkbox') {
                  field.checked = formData[fieldName] || false;
                } else {
                  field.value = formData[fieldName] || '';
                }
              }
            });
          } catch (e) {
            console.error('Ошибка при восстановлении данных:', e);
          }
        }
      }
      
      function clearFormData() {
        formFields.forEach(fieldName => {
          const field = document.getElementById(fieldName);
          if (field) {
            if (field.type === 'checkbox') {
              field.checked = false;
            } else {
              field.value = '';
            }
          }
        });
        localStorage.removeItem('feedbackFormData');
      }
      
      feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        const formEndpoint = 'https://formcarry.com/s/Fc5CJQw31NU';

        fetch(formEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => {
          if (response.ok) {

            successAlert.style.display = 'block';
            errorAlert.style.display = 'none';

            clearFormData();

            setTimeout(() => {
              closeModal();
            }, 2000);
          } else {
            throw new Error('Ошибка сети');
          }
        })
        .catch(error => {
          console.error('Ошибка:', error);
          successAlert.style.display = 'none';
          errorAlert.style.display = 'block';
        });
      });
      
      formFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
          field.addEventListener('input', saveFormData);
          if (field.type === 'checkbox') {
            field.addEventListener('change', saveFormData);
          }
        }
      });

      if (window.location.hash === '#feedback-form') {
        openFormBtn.click();
      }
    });