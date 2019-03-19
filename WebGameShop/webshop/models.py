from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from .utils import ChoiceEnum, JSONField

# EnumChoices here
class CupsTypes(ChoiceEnum):
    GOLD = 0
    SILVER =  1
    BRONZE = 2
    NONE = 3

# Create your models here.

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="player")
    games = models.ManyToManyField('Game', blank=True)
    profile_pic = models.ImageField()

    def __str__(self):
        return self.user.username

class Game(models.Model):
    name = models.CharField(max_length=200, default="UNKNOWN")
    description = models.CharField(max_length=2000, blank=True)
    icon = models.ImageField(blank=True)
    price = models.FloatField(
        default=0,
        validators=[
            MinValueValidator(0.0),
        ]
    )
    times_purchased = models.IntegerField(default=0)

    class Meta:
        ordering = ("name",)

class Score(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    cup = models.CharField(max_length=1, choices=CupsTypes.choices())

class Rating(models.Model):
    player = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    score = models.FloatField(
        default=0,
        validators=[
            MinValueValidator(0.0),
            MaxValueValidator(5.0)
        ]
    )

class State(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    state = JSONField()
