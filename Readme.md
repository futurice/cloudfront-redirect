# AWS CloudFront authenticated proxy #

Host login-only website in AWS S3 + CloudFront without generating AWS
credentials for all users.

Inspired by https://github.com/aesopwolf/s3-basic-auth

## HOWTO ##

1. Create S3 bucket for your content.
2. Create AWS IAM user with write access to that bucket.
3. Modify the documents in the `html`-directory to your needs and copy to S3.
4. Add other files you need (html, css, js) to S3 bucket.
5. Make sure you don't give everyone permission to read the files.
6. Create CloudFront distribution for [serving private content][cloudfront-
   privatecontent]

    1. Create CloudFront distribution
    2. Create CloudFront key pair (requires AWS root credentials) and download
       the private key to your computer.
    3. Create Distribution behavior that allows reading documents in
       `error`-folder without signed URL.
    4. Configure custom error pages for HTTP 403 and 404.

7. Configure Docker to run this application with following environment
   variables:
    ```
    CLOUDFRONT_PRIVKEY=
    CLOUDFRONT_DISTRIBUTION_DOMAIN=
    AWS_ACCESS_KEY_ID=
    ```
8. Make sure the Docker container is behind a reverse proxy that somehow
   authenticates the user.
9. Browse to the proxy url.
10. Notice that you are redirected to cloudfront and are able to access the
    files for few moments.

## IAM User policy: Write permissions ##
Attach the following policy to iam user to give write permissions to specific
S3 bucket.

```
{
   "Version": "2012-10-17",
   "Statement": [
        {
            "Sid": "AllowManipulatingObjects",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": ["arn:aws:s3:::bucketname/*"]
        },
        {
            "Sid": "AllowListingBucket",
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation",
                "s3:GetBucketWebsite"
            ],
            "Resource": ["arn:aws:s3:::bucketname"]
        },
    ]
}
```

# Building and running with Docker

```
docker build -t cloudfront-redirect .
docker container run -P -it \
    -e CLOUDFRONT_DISTRIBUTION_DOMAIN=something.cloudfront.net \
    -e CLOUDFRONT_PRIVKEY=$(cat path/to/private/key) \
    -e AWS_ACCESS_KEY_ID=insert_access_Kkey \
    cloudfront-redirect
```

The image is also available at https://hub.docker.com/r/futurice/cloudfront-redirect/

[aws-hosting-intro]: https://docs.aws.amazon.com/gettingstarted/latest/swh/website-hosting-intro.html "Hosting a Static Website on Amazon Web Services"
[cloudfront-privatecontent]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html "Serving Private Content through CloudFront"
