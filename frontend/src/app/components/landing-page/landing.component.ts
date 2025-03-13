import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { HeaderComponent } from "../shared/header/header.component"
import { FooterComponent } from "../shared/footer/footer.component"

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: "./landing.component.html",
})
export class LandingComponent {
  featuredProperties = [
    {
      id: 1,
      title: "Appartement Moderne",
      location: "Quartier Gauthier, Casablanca",
      image: "https://i.pinimg.com/474x/5a/28/de/5a28de8ace9993c432da0d197ba8b4a7.jpg",
      price: 8500,
      bedrooms: 3,
      bathrooms: 2,
      area: 130,
      type: "location",
    },
    {
      id: 2,
      title: "Villa avec Piscine",
      location: "Californie, Casablanca",
      image: "https://i.pinimg.com/474x/5a/58/e3/5a58e35d88afea855ccbff68642c46ac.jpg",
      price: 15000,
      bedrooms: 4,
      bathrooms: 3,
      area: 250,
      type: "location",
    },
    {
      id: 3,
      title: "Duplex Contemporain",
      location: "Hivernage, Marrakech",
      image: "https://i.pinimg.com/474x/a8/24/19/a82419aaca68c92eb44b12f4596ae278.jpg",
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      type: "vente",
    },
    {
      id: 4,
      title: "Appartement Vue Mer",
      location: "Corniche, Tanger",
      image: "https://i.pinimg.com/736x/e7/70/e7/e770e79734a68ad5d11a248026cc226d.jpg",
      price: 1800000,
      bedrooms: 2,
      bathrooms: 2,
      area: 110,
      type: "vente",
    },
  ]

  cities = [
    {
      name: "Marrakech",
      properties: 154,
      image: "https://i.pinimg.com/474x/52/a7/24/52a7240269e271688b823a4b24075b60.jpg",
    },
    {
      name: "Rabat",
      properties: 231,
      image: "https://i.pinimg.com/474x/ae/34/0b/ae340b43d0c7243e61a4e328e6e9309d.jpg",
    },
    {
      name: "Casablanca",
      properties: 327,
      image: "https://i.pinimg.com/474x/2c/78/d9/2c78d9f196b0e3d4872af00ec488d1c6.jpg",
    },
    {
      name: "Agadir",
      properties: 185,
      image: "https://i.pinimg.com/474x/db/2c/ca/db2ccabf9c6b026924039030e0ad8713.jpg",
    },
    {
      name: "Tanger",
      properties: 142,
      image: "https://i.pinimg.com/474x/5b/1c/16/5b1c162363f2ac88c9b009bd320852d6.jpg",
    },
    {
      name: "Al Hoceima",
      properties: 95,
      image: "https://i.pinimg.com/474x/b8/67/bf/b867bf849c435db3e381b314288cdbd4.jpg",
    },
    {
      name: "Dakhla",
      properties: 78,
      image: "https://i.pinimg.com/736x/d6/a6/2e/d6a62e5b3512e88ce99f9d2856eb2b67.jpg",
    },
    {
      name: "Laâyoune",
      properties: 124,
      image: "https://i.pinimg.com/474x/f3/8a/a6/f38aa632b10fa6b81bc583f061d98e6a.jpg",
    },
  ]

  agents = [
    {
      name: "Karim Benali",
      title: "Agent Immobilier",
      image: "https://i.pinimg.com/736x/cd/55/be/cd55bed98ccd1085d0c5eae0ac929c3d.jpg",
    },
    {
      name: "Mehdi Tazi",
      title: "Agent Immobilier",
      image: "https://i.pinimg.com/736x/ea/18/eb/ea18eb32e225e842c41d60bed7ce49f8.jpg",
    },
    {
      name: "Leila Kadiri",
      title: "Agent Immobilier",
      image: "https://i.pinimg.com/474x/c7/9a/37/c79a37e13ef14be556b51143bcbb1b01.jpg",
    },
    {
      name: "Rachid Alaoui",
      title: "Agent Immobilier",
      image: "https://i.pinimg.com/474x/41/7e/b3/417eb31180f47f1f87a3b0023ec1a38a.jpg",
    },
  ]

  articles = [
    {
      title: "10 Conseils de Décoration Intérieure pour 2024",
      excerpt:
        "Découvrez les dernières tendances en matière de décoration intérieure et comment les appliquer à votre espace de vie.",
      image: "https://i.pinimg.com/474x/bb/a8/85/bba88559dfffc00fc749068cac3e3f6f.jpg",
      author: "Karim Benali",
      authorImage: "https://i.pinimg.com/474x/02/f9/cb/02f9cb864fe973e7cb1733e5b4a7c53a.jpg",
      date: "15 Avril 2024",
    },
    {
      title: "Guide d'Investissement Immobilier au Maroc en 2024",
      excerpt:
        "Apprenez les meilleures stratégies pour investir dans l'immobilier et maximiser vos rendements sur le marché actuel.",
      image: "https://i.pinimg.com/736x/ce/39/30/ce39308c7ad0e4031a9c5e3b8f65e459.jpg",
      author: "Leila Kadiri",
      authorImage: "https://i.pinimg.com/474x/be/59/13/be5913c352f3f1e7dfa7f86b0f9a2ee1.jpg",
      date: "10 Avril 2024",
    },
    {
      title: "Comment Préparer Votre Maison pour une Vente Rapide",
      excerpt:
        "Conseils efficaces de mise en valeur qui peuvent vous aider à vendre votre propriété plus rapidement et à un meilleur prix.",
      image: "https://i.pinimg.com/474x/d4/c0/93/d4c0938293f044cca0d57f02d8af6b9c.jpg",
      author: "Rachid Alaoui",
      authorImage: "https://i.pinimg.com/474x/b3/e5/f6/b3e5f62a2766138819a30248c62128bf.jpg",
      date: "5 Avril 2024",
    },
  ]

  partners = [
    { name: "Marjane", logo: "https://www.dreamjob.ma/wp-content/uploads/2022/07/Marjane-Emploi-Recrutement-1.png" },
    { name: "TotalEnergies", logo: "https://club.totalenergies.ma/img/logo.png" },
    {
      name: "Xiaomi",
      logo: "https://e7.pngegg.com/pngimages/234/461/png-clipart-xiaomi-mi-1-graphics-logo-xiaomi-logo-text-trademark-thumbnail.png",
    },
    { name: "Crédit Agricole", logo: "https://upload.wikimedia.org/wikipedia/fr/0/02/Logo-credit-agricol-maroc.jpg" },
    {
      name: "Inwi",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Logo_inwi.svg/2560px-Logo_inwi.svg.png",
    },
  ]

  formatPrice(price: number, type: string): string {
    if (type === "location") {
      return `${price.toLocaleString("fr-MA")} DH/mois`
    } else {
      return `${price.toLocaleString("fr-MA")} DH`
    }
  }
}

