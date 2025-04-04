export const userData = {
  currentUser: {
    id: 1,
    fullName: "John Doe",
    email: "johndoe@example.com",
    location: "New York, USA",
    phone: "+1 234 567 8901",
    cuisine: "Italian",
    dateOfBirth: "05/21/1990",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  users: [
    {
      id: 1,
      fullName: "John Doe",
      email: "johndoe@example.com",
      password: "password123", // Dans un vrai projet, ne stockez jamais les mots de passe en clair
      location: "New York, USA",
      phone: "+1 234 567 8901",
      cuisine: "Italian",
      dateOfBirth: "05/21/1990",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "client"
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "janesmith@example.com",
      password: "password123",
      location: "Los Angeles, USA",
      phone: "+1 987 654 3210",
      cuisine: "French",
      dateOfBirth: "11/15/1985",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "client"
    },
    {
      id: 3,
      fullName: "Tom Brown",
      email: "tombrown@example.com",
      password: "password123",
      location: "Chicago, USA",
      phone: "+1 567 890 1234",
      cuisine: "Japanese",
      dateOfBirth: "03/10/1992",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      role: "restaurateur"
    }
  ]
};

export const restaurantData = {
  restaurants: [
    {
      id: 1,
      name: "Sushi Express",
      description: "Authentic Japanese cuisine",
      address: "123 Sushi St, Los Angeles",
      cuisine: "Japanese",
      rating: 4.7,
      deliveryTime: "25-40min",
      deliveryFee: "$2.99",
      minOrder: "$15",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      dishes: [
        {
          id: 1,
          name: "Salmon Nigiri",
          description: "Fresh salmon over pressed vinegar rice",
          price: 8.99,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        },
        {
          id: 2,
          name: "California Roll",
          description: "Crab, avocado, cucumber, sesame seeds",
          price: 7.99,
          image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        }
      ]
    },
    {
      id: 2,
      name: "Chez Pierre",
      description: "Fine French dining",
      address: "456 French Ave, New York",
      cuisine: "French",
      rating: 4.8,
      deliveryTime: "30-45min",
      deliveryFee: "$3.99",
      minOrder: "$20",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      dishes: [
        {
          id: 3,
          name: "Coq au Vin",
          description: "Chicken slow cooked in wine",
          price: 19.99,
          image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        },
        {
          id: 4,
          name: "Ratatouille",
          description: "Provençal vegetable stew",
          price: 14.99,
          image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        }
      ]
    },
    {
      id: 3,
      name: "Tasty Treats",
      description: "Homestyle American cooking",
      address: "789 Main St, Chicago",
      cuisine: "American",
      rating: 4.5,
      deliveryTime: "20-35min",
      deliveryFee: "$1.99",
      minOrder: "$10",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
      dishes: [
        {
          id: 5,
          name: "Classic Burger",
          description: "Beef patty, lettuce, tomato, cheese",
          price: 9.99,
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80"
        },
        {
          id: 6,
          name: "Mac & Cheese",
          description: "Creamy cheese sauce with elbow macaroni",
          price: 7.99,
          image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        }
      ]
    },
    {
      id: 4,
      name: "Delicious Dishes",
      description: "International cuisine",
      address: "101 Food Ave, Miami",
      cuisine: "International",
      rating: 4.6,
      deliveryTime: "25-40min",
      deliveryFee: "$2.49",
      minOrder: "$12",
      image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      dishes: [
        {
          id: 7,
          name: "Pad Thai",
          description: "Rice noodles, eggs, tofu, bean sprouts, peanuts",
          price: 11.99,
          image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        },
        {
          id: 8,
          name: "Cappuccino",
          description: "Espresso with steamed milk and foam",
          price: 3.99,
          image: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        }
      ]
    }
  ],
  popularDishes: [
    {
      id: 1,
      name: "Salmon Nigiri",
      restaurant: "Sushi Express",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      price: 8.99,
      rating: 4.7
    },
    {
      id: 3,
      name: "Coq au Vin",
      restaurant: "Chez Pierre",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      price: 19.99,
      rating: 4.8
    },
    {
      id: 5,
      name: "Classic Burger",
      restaurant: "Tasty Treats",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1998&q=80",
      price: 9.99,
      rating: 4.5
    },
    {
      id: 8,
      name: "Cappuccino",
      restaurant: "Delicious Dishes",
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      price: 3.99,
      rating: 4.6
    }
  ]
};

export const appStats = {
  restaurants: 200,
  cuisines: 50,
  dishes: "5K+",
  dailyOrders: {
    current: 235,
    orders: 175,
    calories: 250,
  }
};

export const siteContent = {
  homePage: {
    hero: {
      title: "Explore nearby restaurants and",
      subtitle: "Curated selection of local cuisines and dishes",
      ctaPrimary: "Start exploring",
      ctaSecondary: "Add to cart"
    },
    foodieHub: {
      title: "Discover new flavors with FoodieHub's curated collection of trending dishes and cuisines.",
      placeholder: "Enter your location here",
      searchButton: "Search"
    }
  },
  loginPage: {
    title: "Sign In",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    signInButton: "Sign In",
    forgotPassword: "Forgot Password?",
    signUp: "Sign Up",
  },
  profilePage: {
    title: "Profile details",
    subtitle: "Update your info",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    foodDiscover: {
      title: "Food Discover",
      description: "Get personalised recommendations based on your taste. Tell us about your favourite food.",
      button: "Update preferences"
    },
    navigation: {
      profileDetails: "Profile details",
      paymentMethods: "Payment methods",
      rewards: "Rewards",
      orders: "Orders",
      notifications: "Notifications",
      inviteFriends: "Invite friends",
      signOut: "Sign out"
    }
  },
  navigation: {
    logo: "CESI EATS",
    search: "Find a restaurant or dish",
    discover: "Discover",
    restaurants: "Restaurants",
    menu: "Menu",
    signIn: "Sign In"
  },
  footer: {
    orderNow: "OrderNow",
    companies: "Companies",
    tracking: "Tracking",
    notification: "Notification",
    copyright: "© FoodHub 2022"
  }
};

// Auth service simulation
export const authService = {
  login: (email, password) => {
    const user = userData.users.find(u => u.email === email && u.password === password);
    if (user) {
      return { success: true, user: { ...user, password: undefined } };
    }
    return { success: false, message: "Invalid email or password" };
  },
  register: (userInfo) => {
    const exists = userData.users.some(u => u.email === userInfo.email);
    if (exists) {
      return { success: false, message: "User already exists" };
    }
    return { success: true, user: { ...userInfo, id: userData.users.length + 1, password: undefined } };
  },
  updateProfile: (userId, userInfo) => {
    return { success: true, user: { ...userInfo, id: userId, password: undefined } };
  }
}; 