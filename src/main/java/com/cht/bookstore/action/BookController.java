package com.cht.bookstore.action;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cht.bookstore.entity.Book;
import com.cht.bookstore.service.BookService;
import com.cht.bookstore.util.CtxUtil;

/**
 *
 * BookController控制器
 * 
 * @author 创建作者 : XS
 * @date 创建时间 ：2018年7月5日
 */
@WebServlet("/BookController.do")
public class BookController extends BaseController {
    private static final long serialVersionUID = 1L;

    private BookService bookservice;

    @Override
    public void init() throws ServletException {
        bookservice = CtxUtil.getBean(BookService.class);
    }

    // 图书列表Action
    public String ListBook(HttpServletRequest request, HttpServletResponse response) {
        request.setAttribute("books", bookservice.getAllBooks());
        return "/WEB-INF/pages/ListBook.jsp";
    }

    // 删除图书Action
    public String Delete(HttpServletRequest request, HttpServletResponse response) {
        int id = Integer.parseInt(request.getParameter("id"));
        request.setAttribute("message", bookservice.delete(id) > 0 ? "删除成功！" : "删除失败！");
        request.setAttribute("books", bookservice.getAllBooks());
        return "/WEB-INF/pages/ListBook.jsp";
    }

    // 多删除图书Action
    public String Deletes(HttpServletRequest request, HttpServletResponse response) {
        String[] ids = request.getParameterValues("ids");
        if (ids!=null&&ids.length > 0) {
            request.setAttribute("message", bookservice.deleteAll(ids) > 0 ? "删除成功！" : "删除失败！");
        } else {
            request.setAttribute("message", "请选择删除项！");
        }
        request.setAttribute("books", bookservice.getAllBooks());
        return "/WEB-INF/pages/ListBook.jsp";
    }

    // 添加图书Action
    public String AddBook(HttpServletRequest request, HttpServletResponse response) {
        return "/WEB-INF/pages/AddBook.jsp";
    }

    // 保存添加图书Action
    public String AddBookPost(HttpServletRequest request, HttpServletResponse response) {
        try {
            String title = request.getParameter("title");
            double price = Double.parseDouble(request.getParameter("price"));

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date publishDate = simpleDateFormat.parse(request.getParameter("publishDate"));

            Book entity = new Book(0, title, price, publishDate);
            if (bookservice.add(entity) > 0) {
                request.setAttribute("model", new Book());
                request.setAttribute("message", "添加成功！");
            } else {
                request.setAttribute("model", entity);
                request.setAttribute("message", "添加失败！");
            }
        } catch (Exception exp) {
            request.setAttribute("message", exp.getMessage());
            exp.printStackTrace();
        }
        return "/WEB-INF/pages/AddBook.jsp";
    }
    
        //编辑图书Action
        public String EditBook(HttpServletRequest request, HttpServletResponse response) {
            int id = Integer.parseInt(request.getParameter("id"));
            Book model=bookservice.getBookById(id);
            request.setAttribute("model", model);
            return "/WEB-INF/pages/EditBook.jsp";
        }

        // 保存编辑图书Action
        public String EditBookPost(HttpServletRequest request, HttpServletResponse response) {
            try {
                int id=Integer.parseInt(request.getParameter("id"));
                
                String title = request.getParameter("title");
                double price = Double.parseDouble(request.getParameter("price"));

                SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date publishDate = simpleDateFormat.parse(request.getParameter("publishDate"));

                Book entity = new Book(id, title, price, publishDate);
                request.setAttribute("message", bookservice.update(entity) > 0 ? "更新成功！" : "更新失败！");
                request.setAttribute("model", entity);
            } catch (Exception exp) {
                request.setAttribute("message", exp.getMessage());
                exp.printStackTrace();
            }
            return "/WEB-INF/pages/EditBook.jsp";
        }

}
