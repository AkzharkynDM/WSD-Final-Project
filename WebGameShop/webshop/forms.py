# log/forms.py
from django.contrib.auth.forms import AuthenticationForm
from django import forms

from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

# docs on AuthenticationForm and UserCreationForm:
# https://docs.djangoproject.com/en/1.8/_modules/django/contrib/auth/forms/


# inherit AuthenticationForm and create own Login form
class LoginForm(AuthenticationForm):

    username = forms.CharField(label="Username", max_length=30, widget=forms.TextInput(
    attrs={'class': 'form-control',
           'name': 'username',
           'placeholder': 'Username'
    }))
    password = forms.CharField(label="Password", max_length=30, widget=forms.TextInput(
    attrs={'class': 'form-control',
           'name': 'password',
           'placeholder': 'Password',
           'type': 'password'
    }))


class RegistrationForm(UserCreationForm):

    email = forms.EmailField(required=True)

    # define meta data related to RegistrationForm
    class Meta:
        # Use the django user model
        # https://docs.djangoproject.com/en/1.10/ref/contrib/auth/
        model = User
        fields = (
            'username',
            'email',
            'password1',
            'password2'
        )

    # allows the form to save the data to the model
    # commit == 'save the data to the database'   
    def save(self, commit=True):

        # super calls that class's save method, with self bound to the first argument.
        #  commit is False because we still need to add email to model
        user = super(RegistrationForm, self).save(commit=False)

        # cleaned_data == django function to sanitize input
        # this is also done by the UserCreationForm for the password and username
        user.email = self.cleaned_data['email']

        # if we want to save data ('commit')
        if commit:
            user.save()

        return user


