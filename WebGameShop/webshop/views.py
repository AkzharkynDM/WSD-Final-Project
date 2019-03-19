from django.http import HttpResponse, Http404
from django.shortcuts import render, loader, redirect
from webshop.models import Game
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .forms import RegistrationForm

def starting_instructions(request):
    return render(request, "webshop/instructions.html", {})

def home(request):
    return render(request, "webshop/home.html")

def login(request):
    return render(request, "registration/login.html")

def profile(request):
    return render(request, "registration/profile.html")

def register_as(request):
    return render(request, "registration/register_as.html")

def register_success(request):
    return render(request, "registration/register_success.html")

def register(request):
    return render(request, "registration/register.html")

def Player_register(request):

    # if user is sending data to the web server
    # aka user presses the submit button
    if request.method == 'POST':
        # UserCreation form is djangos built in form, change this ??
        # this renders the from fields "username, password and Password confirmation:"

        # takes POST data and insert it in 'from'
        form = RegistrationForm(request.POST)

        # checks if everything is valid in the form (from usercreationform )
        # username is not taken, valid password etc..
        # TODO: sanitize input ?? this is done by UserCreationForm and RegistrationForm
        if form.is_valid():

            # save content of form and assign it to user variable
            # from docs: 'This method creates and saves a database object from the data bound to the form.'
            user = form.save()

            # adds user to group
            #group, created = Group.objects.get_or_create(name='Players')
            #print(group)
            #group.user_set.add(user)
            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
            login(request, user)
            # rederict to register_success page
            return redirect('/register_success')

        # if form input is not valid, redirect to the same page
        # TODO: display the right error somehow ?
        else:
            args = {'form': form}
            return render(request, "registration/register_as.html", args)

    # request.method will be GET -> display form to user
    else:

        # create form RegistrationForm. see 'log/forms.py'
        form = RegistrationForm()

        # form needs to be passed to the template
        # create a dictionary
        # we can now refer to the form  in the template
        # see: register.html '{{ form.as_p }}' as_p == as paragraph element

        # key is used in template
        # variable is actual data
        args = {'form': form}

        # render template with form
        return render(request, "registration/register.html", args)


# same as Player_register but with group set to 'Developers'
def Developer_register(request):

    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()

            user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
            login(request, user)
            return redirect('/register_success')
        else:
            args = {'form': form}
            return render(request, "registration/register_as.html", args)
    else:
        form = RegistrationForm()
        args = {'form': form}
        return render(request, "registration/register.html", args)

def gameview(request, game_id):
    """
    Write your view implementations for exercise 4 here.
    Remove the current return line below.
    """
    try:
        p = Game.objects.get(pk=game_id)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    c = {'game': p}
    message = render_to_string('webshop/product_view.html', c)
    return HttpResponse(message)
    #return HttpResponse("product {}".format(product_id))

def available_products(request):
    """
    Write your view implementations for exercise 4 here.
    Remove the current return line below.
    """
    try:
        products = Game.objects.filter(quantity__gt=0)
    except Game.DoesNotExist:
        raise Http404("Game does not exist")
    c ={'games': games}
    message = render_to_string('webshop/product_list.html', c)
    return HttpResponse(message)
    #return HttpResponse("View not implemented!")
