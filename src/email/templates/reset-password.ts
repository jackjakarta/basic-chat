export function resetPasswordTemplate({ actionUrl }: { actionUrl: string }) {
  return {
    Subject: { Data: 'Reset password' },
    Body: {
      Html: {
        Data: resetPasswordHtml.replace('$RESET_LINK', actionUrl),
      },
    },
  };
}

export const resetPasswordHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en"
  ><head
    ><meta name="viewport" content="width=device-width" /><link
      rel="preload"
      as="image"
      href="https://kglrzykqhwkegojcqach.supabase.co/storage/v1/object/public/assets//logo-margin.png"
    /><meta content="text/html; charset=UTF-8" http-equiv="Content-Type" /><meta
      name="x-apple-disable-message-reformatting"
    /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta
      name="x-apple-disable-message-reformatting"
    /><meta
      name="format-detection"
      content="telephone=no,address=no,email=no,date=no,url=no"
    /><meta name="color-scheme" content="light" /><meta
      name="supported-color-schemes"
      content="light"
    /><!--$--><style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'sans-serif';
        src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');
      }

      * {
        font-family: 'Inter', sans-serif;
      }</style
    ><style>
      blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-pad{padding:0!important}}
    </style></head
  ><body style="margin:0"
    ><table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:600px;min-width:300px;width:100%;margin-left:auto;margin-right:auto;padding:0.5rem"
      ><tbody
        ><tr style="width:100%"
          ><td
            ><table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="margin-top:0px;margin-bottom:0px"
              ><tbody style="width:100%"
                ><tr style="width:100%"
                  ><td align="left" data-id="__react-email-column"
                    ><img
                      title="Image"
                      alt="Image"
                      src="https://kglrzykqhwkegojcqach.supabase.co/storage/v1/object/public/assets//logo-margin.png"
                      style="display:block;outline:none;border:none;text-decoration:none;width:168px;max-width:100%" /></td></tr></tbody></table
            ><table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:37.5em;height:64px"
              ><tbody
                ><tr style="width:100%"><td></td></tr></tbody></table
            ><p
              style="font-size:15px;line-height:26.25px;margin:0 0 0px 0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151"
              ><span style="color:rgb(0, 0, 0)"
                >Click on the button below to reset your password</span
              ><span style="color:#000000">:</span></p
            ><table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:37.5em;height:16px"
              ><tbody
                ><tr style="width:100%"><td></td></tr></tbody></table
            ><table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:100%;text-align:left;margin-bottom:0px"
              ><tbody
                ><tr style="width:100%"
                  ><td
                    ><a
                      href="$RESET_LINK"
                      style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;color:#ffffff;background-color:#3f4026;border-color:#3f4026;border-width:2px;border-style:solid;font-size:14px;font-weight:500;border-radius:6px;padding:8px 24px 8px 24px"
                      target="_blank"
                      ><span
                        ><!--[if mso
                          ]><i style="mso-font-width:400%;mso-text-raise:12" hidden
                            >&#8202;&#8202;&#8202;</i
                          ><!
                        [endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:6px"
                        >Reset Password</span
                      ><span
                        ><!--[if mso
                          ]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8203;</i><!
                        [endif]--></span
                      ></a
                    ></td
                  ></tr
                ></tbody
              ></table
            ><table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:37.5em;height:64px"
              ><tbody
                ><tr style="width:100%"><td></td></tr></tbody></table
            ><p
              style="font-size:14px;line-height:24px;margin:16px 0;color:#64748B;margin-top:0px;margin-bottom:0px;text-align:left;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale"
              ><span style="color:rgb(153, 153, 153)"
                >If you did not request a password reset, please ignore this email. However, if you
                believe this was a mistake or unauthorized, please contact our support team
                immediately.</span
              ></p
            ><table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:37.5em;height:16px"
              ><tbody
                ><tr style="width:100%"><td></td></tr></tbody></table
            ><hr
              style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px"
            /><p
              style="font-size:15px;line-height:26.25px;margin:0 0 20px 0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151"
              ><a
                href="https://chat.codebyalex.dev"
                rel="noopener noreferrer nofollow"
                style="color:#111827;text-decoration:none;font-weight:500"
                target="_blank"
                ><span style="color:#000000">chat.codebyalex.dev</span></a
              ><br /><a
                href="https://chat.codebyalex.dev/privacy-policy"
                rel="noopener noreferrer nofollow"
                style="color:#111827;text-decoration:none;font-weight:500"
                target="_blank"
                ><span style="color:#000000">Privacy Policy</span></a
              ><br /><a
                href="https://chat.codebyalex.dev/contact"
                rel="noopener noreferrer nofollow"
                style="color:#111827;text-decoration:none;font-weight:500"
                target="_blank"
                ><span style="color:#000000">Contact</span></a
              ><br /><a
                href="https://chat.codebyalex.dev/terms"
                rel="noopener noreferrer nofollow"
                style="color:#111827;text-decoration:none;font-weight:500"
                target="_blank"
                ><span style="color:#000000">Terms</span></a
              ></p
            ></td
          ></tr
        ></tbody
      ></table
    ><!--/$--></body
  ></html
>
`;
