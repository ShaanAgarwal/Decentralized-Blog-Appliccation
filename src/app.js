App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    if (window.ethereum) {
      window.ethereum = new Web3(ethereum);
      try {
        await ethereum.enable();
        web3.eth.sendTransaction({});
      } catch (error) {
        console.error("User denied account access.");
      }
    } else if (window.ethereum) {
      App.web3Provider = web3.currentProvider;
      window.ethereum = new Web3(web3.currentProvider);
      web3.eth.sendTransaction({});
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
  },

  loadContract: async () => {
    const blogContract = await $.getJSON("Blog.json");
    App.contracts.Blog = TruffleContract(blogContract);
    App.contracts.Blog.setProvider(App.web3Provider);

    App.blogInstance = await App.contracts.Blog.deployed();
  },

  render: async () => {
    if (App.loading) {
      return;
    }

    App.setLoading(true);

    $("#account").html(App.account);

    await App.renderPosts();

    App.setLoading(false);
  },

  renderPosts: async () => {
    const postCount = await App.blogInstance.postCount();
    const $postList = $("#postList");
    $postList.empty();

    for (let i = 1; i <= postCount; i++) {
      const post = await App.blogInstance.posts(i);
      const postId = post[0].toNumber();
      const postTitle = post[1];
      const postContent = post[2];

      const postTemplate = `<div class="post">
                                  <h3>${postTitle}</h3>
                                  <p>${postContent}</p>
                                </div>`;
      $postList.append(postTemplate);
    }
  },

  createPost: async () => {
    const title = $("#postTitle").val();
    const content = $("#postContent").val();

    await App.blogInstance.createPost(title, content, { from: App.account });
    window.location.reload();
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).on("load", () => {
    App.load();
  });

  $("#createPostForm").on("submit", (e) => {
    e.preventDefault();
    App.createPost();
  });
});
