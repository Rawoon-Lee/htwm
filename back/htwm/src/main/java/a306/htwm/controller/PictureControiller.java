package a306.htwm.controller;


import a306.htwm.config.S3Uploader;
import a306.htwm.dto.PictureDTO;
import a306.htwm.service.PictureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;

@RestController
@RequestMapping("/picture")
@RequiredArgsConstructor
public class PictureControiller {
    private final S3Uploader s3Uploader;
    private final PictureService pictureService;

    @PostMapping("")
    public ResponseEntity upload(@RequestPart("image") MultipartFile multipartFile,@RequestParam("username") String username){
        String uploadUrl;
        try {
            uploadUrl = s3Uploader.uploadFiles(multipartFile, "body");
        } catch (Exception e) {
            throw new RuntimeException("파일을 읽을 수 없습니다.");
        }
        pictureService.join(uploadUrl,username);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("")
    @ResponseBody
    public ResponseEntity delete(String username, String dateTime){
        try{
            pictureService.delete(username,dateTime);
        }catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("")
    public ResponseEntity<ArrayList<PictureDTO>> getPic(@RequestParam("username") String username, @RequestParam("date") String date){
        try{
            return ResponseEntity.ok().body(pictureService.getPic(username,date));
        }catch(Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<String> upload(@RequestPart("image") MultipartFile multipartFile){
        String uploadUrl;
        try {
            uploadUrl = s3Uploader.uploadFiles(multipartFile, "body");
        } catch (Exception e) {
            throw new RuntimeException("파일을 읽을 수 없습니다.");
        }
        return ResponseEntity.ok().body(uploadUrl);
    }
}
