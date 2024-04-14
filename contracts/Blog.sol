pragma solidity ^0.5.0;

contract Blog {
    uint public postCount = 0;

    struct Post {
        uint id;
        string title;
        string content;
        address author;
        uint timestamp;
    }

    mapping(uint => Post) public posts;

    event PostCreated(
        uint id,
        string title,
        string content,
        address author,
        uint timestamp
    );

    constructor() public {
        createPost("Welcome to My Blog", "This is the first post on my blog. Stay tuned for more!");
    }

    function createPost(string memory _title, string memory _content) public {
        postCount++;
        posts[postCount] = Post(postCount, _title, _content, msg.sender, now);
        emit PostCreated(postCount, _title, _content, msg.sender, now);
    }
}
